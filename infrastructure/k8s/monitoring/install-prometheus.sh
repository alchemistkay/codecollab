#!/bin/bash

set -e

echo "Installing Prometheus & Grafana monitoring stack..."

# Check if already installed
if kubectl get namespace monitoring &> /dev/null; then
    echo "Monitoring namespace already exists. Skipping installation."
    exit 0
fi

# Download kube-prometheus
KUBE_PROMETHEUS_VERSION="v0.13.0"
DOWNLOAD_DIR="/tmp/kube-prometheus"

echo "Downloading kube-prometheus ${KUBE_PROMETHEUS_VERSION}..."
mkdir -p ${DOWNLOAD_DIR}
cd ${DOWNLOAD_DIR}

wget -q https://github.com/prometheus-operator/kube-prometheus/archive/refs/tags/${KUBE_PROMETHEUS_VERSION}.tar.gz
tar -xzf ${KUBE_PROMETHEUS_VERSION}.tar.gz
cd kube-prometheus-${KUBE_PROMETHEUS_VERSION#v}

# Install
echo "Creating CRDs..."
kubectl create -f manifests/setup

echo "Waiting for CRDs to be established..."
until kubectl wait --for condition=Established --all CustomResourceDefinition --namespace=monitoring --timeout=5s 2>/dev/null; do
    sleep 5
done

echo "Creating monitoring stack..."
kubectl create -f manifests/

echo "Waiting for monitoring pods to be ready..."
kubectl wait --for=condition=available --timeout=300s \
  deployment/prometheus-operator \
  deployment/grafana \
  -n monitoring

# Cleanup
cd /
rm -rf ${DOWNLOAD_DIR}

echo ""
echo "Monitoring stack installed successfully!"
echo ""
echo "Access Grafana:"
echo "  kubectl port-forward -n monitoring svc/grafana 3000:3000"
echo ""
echo "Access Prometheus:"
echo "  kubectl port-forward -n monitoring svc/prometheus-k8s 9090:9090"
echo ""
echo "Get Grafana password:"
echo "  kubectl get secret grafana -n monitoring -o jsonpath='{.data.admin-password}' | base64 -d"
echo ""
