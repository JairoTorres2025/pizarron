# 🐺 Wolf Carports — Pizarrón

Sistema de tablero de llamadas en tiempo real para Wolf Reps. El admin asigna clientes editando la hoja de Google Sheets, y los Wolf Reps ven sus asignaciones actualizadas automáticamente cada 5 segundos.

## Cómo Funciona

**Admin (Pizarrón Admin):** Edita la hoja de Google Sheets directamente para asignar clientes a cada Wolf Rep.

**Wolf Rep (Pizarrón del Llamador):** Abre la app web en el navegador. Ve sus clientes asignados en tiempo real. Cuando contacta a un cliente, hace clic en "Sí ✓" y el cliente desaparece del pizarrón.

### Flujo de Datos
1. Admin escribe en Google Sheets (Teléfono, Nombre, Hora, Urgente, Notas)
2. La app web lee los datos vía Google Sheets API cada 5 segundos
3. Wolf Rep ve los datos actualizados automáticamente
4. Wolf Rep marca "Contactado" → se escribe de vuelta a la hoja vía Apps Script
5. En el siguiente refresh, el cliente desaparece del pizarrón

## Archivos

- `index.html` — App web completa (HTML + CSS + JS en un solo archivo)
- `Code.gs` — Código de Google Apps Script para el endpoint de escritura (Contactado)
- `README.md` — Este archivo

## Google Sheet

**ID:** `1X9OxDWLFsgQMer7v52A5zIAdbzm11l30OvCG1JP7Ozw`

**Tabs:** Nick, Ignacio, Moises, Jairo, Rudy

**Columnas:**
- A: Urgente (Yes/No)
- B: Teléfono (formato internacional)
- C: Nombre
- D: Hora
- E: Notas
- F: Contactado (Yes/No)

## Requisitos

- Python 3 (para el servidor HTTP local)
- Navegador web moderno
- Acceso a la cuenta de Google que posee la hoja (para desplegar el Apps Script)

## Configuración Inicial (Una sola vez)

### Paso 1: Desplegar el Apps Script
Este script actúa como puente entre la app web y la hoja de Google Sheets. No es necesario compartir la hoja públicamente.

1. Abre la hoja en Google Sheets: https://docs.google.com/spreadsheets/d/1X9OxDWLFsgQMer7v52A5zIAdbzm11l30OvCG1JP7Ozw
2. Ve a **Extensiones > Apps Script**
3. Borra el código existente y pega todo el contenido de `Code.gs`
4. Haz clic en **Implementar > Nueva implementación**
5. Tipo: **App web**
6. Ejecutar como: **Yo**
7. Quién tiene acceso: **Cualquier persona**
8. Haz clic en **Implementar** y copia la URL generada (algo como `https://script.google.com/macros/s/XXXX/exec`)

### Paso 2: Configurar la URL en la app
Abre `index.html` en un editor de texto y pega la URL del paso anterior en la línea:
```
APPS_SCRIPT_URL: 'https://script.google.com/macros/s/TU_ID_AQUI/exec',
```

## Comando para Ejecutar

```bash
cd /Users/macair/JairosProjects/Pizarron && python3 -m http.server 8080
```

Luego abrir en el navegador:

- **Nick:** http://localhost:8080?caller=Nick
- **Ignacio:** http://localhost:8080?caller=Ignacio
- **Moises:** http://localhost:8080?caller=Moises
- **Jairo:** http://localhost:8080?caller=Jairo
- **Rudy:** http://localhost:8080?caller=Rudy

### Modo solo (sin tabs de otros Wolf Reps)
Agregar `&solo=true` al URL:
- http://localhost:8080?caller=Nick&solo=true

## Instrucciones para el Admin
1. Completar el número de teléfono o el nombre del cliente como mínimo
2. Si el cliente solicita llamada a cierta hora, colocar en la columna Hora
3. Si el cliente quiere llamada inmediata, marcar la columna Urgente como "Yes"

## Instrucciones para el Wolf Rep
1. La asignación en el pizarrón NO equivale a asignación en el CRM
2. Puede tener solo teléfono o solo nombre — si tiene nombre, buscar en el CRM
3. Fila amarilla con "URGENTE" = el cliente solicita llamada inmediata
4. Si hay hora en la columna Hora, llamar a esa hora
5. Si se conecta con el cliente, hacer clic en "Sí ✓" en Contactado
6. Si no contesta, no hacer nada — puede ser reasignado
