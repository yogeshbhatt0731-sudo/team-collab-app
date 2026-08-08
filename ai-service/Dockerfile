# ===== Stage 1: Install dependencies =====
FROM python:3.12-slim AS builder
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ===== Stage 2: Run the app =====
FROM python:3.12-slim
WORKDIR /app

# Run as a non-root user for security (--home /app so ChromaDB can cache the ONNX embedding model)
RUN addgroup --system appuser && adduser --system --ingroup appuser --home /app appuser

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY app ./app

# ChromaDB persistent data will be mounted as a volume
RUN mkdir -p /app/chroma_data && chown -R appuser:appuser /app

USER appuser

EXPOSE 8083
ENTRYPOINT ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8083"]
