#!/bin/bash

set -e

echo "Deploying CodeCollab to Kubernetes..."
echo ""

# Apply manifests in order
echo "Creating namespace..."
kubectl apply -f base/namespace.yaml

echo ""
echo "Creating PostgreSQL external service..."
kubectl apply -f base/postgres-external.yaml

echo ""
echo "Creating ConfigMap and Secret..."
kubectl apply -f base/configmap.yaml
kubectl apply -f base/secret.yaml

echo ""
echo "Deploying services..."
kubectl apply -f base/session-service.yaml
kubectl apply -f base/execution-service.yaml
kubectl apply -f base/collaboration-service.yaml
kubectl apply -f base/frontend.yaml

echo ""
echo "Creating Ingress..."
kubectl apply -f base/ingress.yaml

echo ""
echo "Waiting for deployments to be ready..."
sleep 10

echo ""
echo "Deployment Status:"
kubectl get deployments -n codecollab
kubectl get pods -n codecollab
kubectl get services -n codecollab
kubectl get ingress -n codecollab

echo ""
echo "CodeCollab deployed to Kubernetes!"
echo ""
echo "Access at: https://codecollab.k4scloud.com"
