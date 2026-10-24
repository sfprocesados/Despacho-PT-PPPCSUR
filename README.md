# Despacho PT · San Fernando · PPPC SUR

App web para escanear las etiquetas de pallet (QR o código de barras) y guardar cada registro en Google Sheets. Desde ahí se copia la información a SAP.

**Archivos**
- `index.html`: la app. Se sube a GitHub Pages.
- `sw.js`: guarda una copia de la app en la tablet para que abra aunque no haya señal. Se sube junto al `index.html`.
- `Code.gs`: el backend. Se pega en el Apps Script de la hoja de Google.
- `logo.png` (opcional): si subes el logo con este nombre junto al `index.html`, aparece en la cabecera.

---

## 1. Google Sheets + Apps Script

1. Crea una hoja de Google nueva, por ejemplo "BD Despacho PT".
2. Abre **Extensiones → Apps Script**, borra el contenido y pega todo `Code.gs`.
3. (Recomendado) Cambia `API_KEY` por una clave propia. Pon la misma en `index.html`.
4. Elige la función **`setup`** y presiona **Ejecutar**. Acepta los permisos. Esto crea la hoja `Despachos`.
5. Ve a **Implementar → Nueva implementación → Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
6. Copia la URL que termina en **`/exec`**.

> Si después cambias `Code.gs`, usa **Implementar → Administrar implementaciones → ✏️ → Versión: Nueva versión**. Así la URL se mantiene igual.

## 2. Subir a GitHub Pages

1. Abre `index.html` y pega la URL `/exec` en `DEFAULT_API_URL`. Revisa también `API_KEY` y `ADMIN_PIN`.
2. Crea un repositorio, por ejemplo `despacho-pt`, y sube `index.html` y `sw.js` (y `logo.png` si lo tienes).
3. Ve a **Settings → Pages → Branch: main / root → Save**.
4. En la tablet, abre `https://TU-USUARIO.github.io/despacho-pt/` en Chrome y permite el uso de la cámara.
5. Menú ⋮ → **Agregar a pantalla principal**, para que se abra como una app.

## 3. Primera vez: el orden del QR

Escanea una etiqueta real. Como todavía no hay configuración, la app abre **Ajustes** y muestra cada dato del QR separado por `*`. Ya viene una propuesta (fechas, descripción, pesos, lote de 9 dígitos, OP de 7 y código de 6). Revisa cada uno, corrige lo que haga falta y guarda.

Esta configuración se guarda en Google Sheets, en una hoja oculta llamada `Config`. Así todas las tablets la usan sin configurar cada una. Para cambiarla después, entra a ⚙️ con el PIN.

## Cómo funciona

- **Escanear**: con la cámara (botón verde) o con una pistola lectora en el campo "Dato escaneado".
- **📌 Fijar**: los campos fijados se mantienen después de guardar. Vienen fijados Placa, Código, Lote Juliano y Cajas, igual que en la app actual. Cada operario puede cambiarlos.
- **Borrador rojo**: borra solo esa casilla. "Limpiar todo" borra todo, incluida la placa.
- **Multiplicador de pallet**: si escriben, por ejemplo, 3, se guarda Cant. Und × 3 y Cajas/Tinas/Sacos × 3. La pantalla muestra el resultado antes de guardar. En la hoja queda la cantidad ya multiplicada y, en otra columna, el multiplicador usado.
- **Repetidos**: si la etiqueta ya fue registrada, la app avisa antes de guardarla otra vez.
- **Sin internet**: el registro se guarda en la tablet ("N pendientes" en la cabecera) y se envía solo cuando vuelve la señal. También se reintenta cada 20 segundos y al volver a abrir la app. Lo guardado no se pierde aunque se cierre la app o se apague la tablet.
- **Historial**: muestra en una tabla todo lo escaneado en el día; se puede cambiar la fecha. Toca cualquier celda para corregirla: las celdas cambiadas se marcan en amarillo y se guardan en Google Sheets con **Guardar cambios**. La papelera elimina la fila, y lo eliminado queda respaldado en la hoja `Eliminados`. Corregir filas ya enviadas necesita internet; las pendientes se corrigen en la tablet.

## Ajustes rápidos en el código

| Qué | Dónde |
|---|---|
| Campos obligatorios | `REQUIRED` en `index.html` |
| Qué campos vienen fijados | `pin:true` en `FIELDS` |
| Orden de columnas para SAP | lista `COLS` en `Code.gs` |
| PIN de ajustes | `ADMIN_PIN` |
