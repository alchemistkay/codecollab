#!/bin/bash

set -e

echo "Deploying CodeCollab to Kubernetes with Advanced Features..."
echo ""

# Check prerequisites
echo "Checking prerequisites..."
if ! kubectl top nodes > /dev/null 2>&1; then
    echo "Warning: Metrics server not available. HPA will not work."
fi

# Apply manifests in order
echo "Creating namespace..."
kubectl apply -f ../base/namespace.yaml

echo ""
echo "Creating PostgreSQL external service..."
kubectl apply -f ../base/postgres-external.yaml

echo ""
echo "Creating ConfigMap and Secret..."
kubectl apply -f ../base/configmap.yaml
kubectl apply -f ../base/secret.yaml

echo ""
echo "Deploying services..."
kubectl apply -f ../base/session-service.yaml
kubectl apply -f ../base/execution-service.yaml
kubectl apply -f ../base/collaboration-service.yaml
kubectl apply -f ../base/frontend.yaml

echo ""
echo "Creating NodePort services..."
kubectl apply -f ../base/services-nodeport.yaml

echo ""
echo "Applying Resource Management..."
kubectl apply -f ../base/resourcequota.yaml
kubectl apply -f ../base/limitrange.yaml

echo ""
echo "Applying Pod Disruption Budgets..."
kubectl apply -f ../base/pdb-session-service.yaml
kubectl apply -f ../base/pdb-execution-service.yaml
kubectl apply -f ../base/pdb-collaboration-service.yaml

echo ""
echo "Applying Horizontal Pod Autoscalers..."
kubectl apply -f ../base/hpa-session-service.yaml
kubectl apply -f ../base/hpa-execution-service.yaml
kubectl apply -f ../base/hpa-collaboration-service.yaml

echo ""
echo "Waiting for deployments to be ready..."
sleep 10

echo ""
echo "===== Deployment Status ====="
echo ""
echo "Deployments:"
kubectl get deployments -n codecollab
echo ""
echo "Pods:"
kubectl get pods -n codecollab
echo ""
echo "Services:"
kubectl get services -n codecollab
echo ""
echo "HPAs:"
kubectl get hpa -n codecollab
echo ""
echo "PDBs:"
kubectl get pdb -n codecollab
echo ""
echo "Resource Quota:"
kubectl describe resourcequota codecollab-quota -n codecollab | grep -A 10 "Resource"
echo ""
echo "============================="
echo ""
echo "CodeCollab deployed successfully!"
echo ""
echo "Access: https://codecollab.k4scloud.com"
echo ""
echo "Monitoring:"
echo "  Prometheus: kubectl port-forward -n monitoring svc/prometheus-k8s 9090:9090"
echo "  Grafana:    kubectl port-forward -n monitoring svc/grafana 3000:3000"
echo ""
echo "Useful commands:"
echo "  kubectl get pods -n codecollab"
echo "  kubectl get hpa -n codecollab -w"
echo "  kubectl top pods -n codecollab"
echo "  kubectl describe quota -n codecollab"
