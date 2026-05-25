#!/usr/bin/env bash
# deploy-azure.sh — Deploy NYC 2026 app to Azure Container Apps
# Usage: bash deploy-azure.sh
# Requires: az CLI logged in, GOOGLE_PLACES_API_KEY in environment or server/.env

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
RESOURCE_GROUP="nyc2026-rg"
LOCATION="eastus"
ACR_NAME="nyc2026acr"          # must be globally unique — change if taken
ENVIRONMENT="nyc2026-env"
STORAGE_ACCOUNT="nyc2026store" # must be globally unique — change if taken
FILE_SHARE="mongodata"

# Pull Google Places key from server/.env if not already set
if [[ -z "${GOOGLE_PLACES_API_KEY:-}" ]]; then
  GOOGLE_PLACES_API_KEY=$(grep GOOGLE_PLACES_API_KEY server/.env | cut -d= -f2)
fi

echo "==> Using resource group : $RESOURCE_GROUP"
echo "==> Location             : $LOCATION"
echo "==> Container registry   : $ACR_NAME"

# ── 1. Resource group ─────────────────────────────────────────────────────────
echo ""
echo "── Step 1/9: Resource group"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none
echo "    ✓ $RESOURCE_GROUP"

# ── 2. Container Registry ─────────────────────────────────────────────────────
echo ""
echo "── Step 2/9: Azure Container Registry"
az acr create \
  --name "$ACR_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --sku Basic \
  --admin-enabled true \
  --output none
ACR_SERVER=$(az acr show --name "$ACR_NAME" --query loginServer -o tsv)
ACR_USER=$(az acr credential show --name "$ACR_NAME" --query username -o tsv)
ACR_PASS=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" -o tsv)
echo "    ✓ $ACR_SERVER"

# ── 3. Build & push images ────────────────────────────────────────────────────
echo ""
echo "── Step 3/9: Build + push server image"
az acr build \
  --registry "$ACR_NAME" \
  --image nyc2026-server:latest \
  --file server/Dockerfile \
  ./server

echo ""
echo "── Step 4/9: Build + push client image"
az acr build \
  --registry "$ACR_NAME" \
  --image nyc2026-client:latest \
  --file client/Dockerfile \
  .

# ── 4. Log Analytics workspace (required for Container Apps env) ──────────────
echo ""
echo "── Step 5/9: Log Analytics workspace"
az monitor log-analytics workspace create \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name nyc2026-logs \
  --output none
LOG_WS_ID=$(az monitor log-analytics workspace show \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name nyc2026-logs \
  --query customerId -o tsv)
LOG_WS_KEY=$(az monitor log-analytics workspace get-shared-keys \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name nyc2026-logs \
  --query primarySharedKey -o tsv)
echo "    ✓ workspace $LOG_WS_ID"

# ── 5. Container Apps environment ─────────────────────────────────────────────
echo ""
echo "── Step 6/9: Container Apps environment"
az containerapp env create \
  --name "$ENVIRONMENT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --logs-workspace-id "$LOG_WS_ID" \
  --logs-workspace-key "$LOG_WS_KEY" \
  --output none
echo "    ✓ $ENVIRONMENT"

# ── 6. Storage for MongoDB persistence ───────────────────────────────────────
echo ""
echo "── Step 7/9: Storage account + file share for MongoDB"
az storage account create \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --output none
STORAGE_KEY=$(az storage account keys list \
  --account-name "$STORAGE_ACCOUNT" \
  --query "[0].value" -o tsv)
az storage share create \
  --name "$FILE_SHARE" \
  --account-name "$STORAGE_ACCOUNT" \
  --output none
az containerapp env storage set \
  --name "$ENVIRONMENT" \
  --resource-group "$RESOURCE_GROUP" \
  --storage-name "$FILE_SHARE" \
  --azure-file-account-name "$STORAGE_ACCOUNT" \
  --azure-file-account-key "$STORAGE_KEY" \
  --azure-file-share-name "$FILE_SHARE" \
  --access-mode ReadWrite \
  --output none
echo "    ✓ $STORAGE_ACCOUNT / $FILE_SHARE"

# ── 7. Deploy MongoDB ─────────────────────────────────────────────────────────
echo ""
echo "── Step 8/9: Deploy containers"
echo "    → mongo"
az containerapp create \
  --name mongo \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENVIRONMENT" \
  --image mongo:7 \
  --cpu 0.5 --memory 1.0Gi \
  --ingress internal \
  --target-port 27017 \
  --transport tcp \
  --min-replicas 1 --max-replicas 1 \
  --output none

# Attach the Azure Files volume to MongoDB
az containerapp update \
  --name mongo \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars MONGO_INITDB_DATABASE=nyc2026 \
  --volumes "name=$FILE_SHARE,storageType=AzureFile,storageName=$FILE_SHARE" \
  --volume-mount "volumeName=$FILE_SHARE,mountPath=/data/db" \
  --output none
echo "    ✓ mongo (internal TCP :27017)"

# ── 8. Deploy Express server ──────────────────────────────────────────────────
echo "    → server"
az containerapp create \
  --name server \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENVIRONMENT" \
  --image "$ACR_SERVER/nyc2026-server:latest" \
  --registry-server "$ACR_SERVER" \
  --registry-username "$ACR_USER" \
  --registry-password "$ACR_PASS" \
  --cpu 0.5 --memory 1.0Gi \
  --ingress internal \
  --target-port 3001 \
  --min-replicas 1 --max-replicas 1 \
  --env-vars \
    "MONGO_URI=mongodb://mongo/nyc2026" \
    "PORT=3001" \
    "GOOGLE_PLACES_API_KEY=$GOOGLE_PLACES_API_KEY" \
  --output none
echo "    ✓ server (internal HTTP :3001)"

# ── 9. Deploy nginx client ────────────────────────────────────────────────────
echo "    → client"
az containerapp create \
  --name client \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENVIRONMENT" \
  --image "$ACR_SERVER/nyc2026-client:latest" \
  --registry-server "$ACR_SERVER" \
  --registry-username "$ACR_USER" \
  --registry-password "$ACR_PASS" \
  --cpu 0.5 --memory 1.0Gi \
  --ingress external \
  --target-port 80 \
  --min-replicas 1 --max-replicas 1 \
  --env-vars "API_UPSTREAM=http://server" \
  --output none

APP_URL=$(az containerapp show \
  --name client \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" -o tsv)

echo "    ✓ client (public HTTPS)"
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "  🗽  NYC 2026 is live at:"
echo "      https://$APP_URL"
echo "╚══════════════════════════════════════════════════════╝"
