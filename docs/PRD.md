# PRD — Lista de Espera Digital Mesa247

> Product Requirements Document del piloto. Fuente primaria: encargo del
> Lead Product Designer (`prueba-fullstack-mesa247-pages-dev.md`).
> Complementos: `nota_tecnica_mesa247.md` (arquitectura), `docs/roadmap.md` (plan).

## 1. Contexto y problema

Los restaurantes con mucho walk-in tienen los viernes colas de 30 a 40
personas en la puerta, anotadas en un cuaderno. Consecuencias:

- Se pierden nombres y se pierde gente: los comensales se van sin avisar.
- El anfitrión no da abasto y no puede priorizar a clientes frecuentes.
- No hay visibilidad del tiempo de espera ni datos del día siguiente.

## 2. Objetivo del piloto

Digitalizar la lista de espera en **3 locales** (La Terraza Azul y Cuatro
Vientos en Lima; Casa Mediterránea en Santiago) en **3 semanas**:

1. El comensal entra a la cola escaneando un QR, sin pedirle nada más que
   nombre, teléfono y cuántos son.
2. Ve su posición en vivo y un tiempo estimado en su celular.
3. El anfitrión gestiona la cola desde una tablet compartida.
4. Al cierre, un reporte con la gente que se fue sin sentarse.

## 3. Usuarios y situaciones

| Usuario | Situación |
|---------|-----------|
| **Comensal (walk-in)** | En la puerta, con datos móviles (wifi malo), sin querer bajar una app. Quiere saber cuánto falta y no perder su turno. |
| **Anfitrión** | Tablets compartidas en la entrada; los viernes hay 2 atendiendo a la vez. Prioriza frecuentes y llama mesas. |
| **Gerente del local** | Quiere el reporte del día: cuánta gente se fue sin sentarse y por qué. |

## 4. Alcance del piloto (MVP)

### 4.1 Se construye

- **Comensal — Unirse**: formulario vía QR/slug (`/join/{slug}`) con nombre,
  teléfono y comensales. Devuelve ticket + posición.
- **Comensal — Tu turno**: posición en vivo (baja al avanzar), tiempo
  estimado, botón "Ya no voy".
- **Comensal — Llamado**: aviso prominente in-app cuando la mesa está lista
  (reemplazo del WhatsApp para el piloto) con botones "Voy en camino" /
  "Ya no voy".
- **Anfitrión — Cola**: tabla en vivo, llamar/sentar/cancelar, priorizar a
  frecuentes, modal con QR por si la puerta se llena.
- **Reporte del día**: conteos de cierre (unidos, sentados, sin sentarse, no
  vinieron, espera media).

### 4.2 No se construye en el piloto (Fase 2)

- WhatsApp Business API / plantillas Meta (**reemplazado por aviso in-app**).
- Drag & drop complejo (**reemplazado por acciones de priorización rápidas**).
- Onboarding/CRUD de restaurantes (**seed automático de los 3 locales**).
- Envío del reporte por correo (**vista web + endpoint**; worker de mail se evalúa en Fase 2).
- Login de anfitriones (las tablets son compartidas; se asume confianza del local).

### 4.3 Principio de producto: mobile first

- **Comensal**: experiencia **mobile first** — el celular en la puerta con
  datos móviles (el wifi del local es malo). Vistas optimizadas para
  pantallas chicas, livianas y tolerantes a cortes de red.
- **Anfitrión**: vista **responsive** para tablet porque el brief lo exige
  (tablets compartidas en la entrada), pero sin experiencia dedicada.
- **No se cubre por ahora**: experiencia dedicada de tablet/desktop —
  dashboard de escritorio, app nativa, drag & drop complejo, multi-pantalla.

## 5. Flujos

### 5.1 Comensal

```
[QR en la puerta] → /join/{slug} → formulario → entra a la cola
→ /tickets/{id} → posición en vivo (polling 5 s)
→ "¡Carla, tu mesa está lista!" (banner in-app)
   → "Voy en camino" (estado NOTIFIED, esperando sentarse)
   → "Ya no voy"    (estado NO_SHOW)
```

### 5.2 Anfitrión

```
/host/{slug} → cola en vivo ordenada por posición
→ Llamar   (WAITING → NOTIFIED, dispara el aviso al comensal)
→ Sentar   (NOTIFIED → SEATED)
→ Cancelar (→ CANCELLED)
→ Priorizar (reordena: frecuente arriba, last-write-wins)
→ modal QR para la puerta
```

## 6. Reglas de negocio

- **Posición**: contigua (`1..N`), sin huecos. Al sentar/cancelar/no-show,
  la cola se reindexa.
- **Reordenar**: el anfitrión envía el orden completo de IDs; se aplica
  *last-write-wins* sobre `position_index` (2 tablets pueden chocar; la
  última escritura gana y la otra sincroniza en el próximo poll).
- **Llamado**: un ticket solo se sienta si antes fue llamado
  (`WAITING → NOTIFIED → SEATED`).
- **Tiempo estimado**: derivado de la posición y del ritmo histórico del
  local (promedio móvil de sentados recientes); se recalcula con cada poll.
- **No-show (D1)**: si el comensal no responde ni llega, **no se auto-cancela**;
  el ticket pasa a estado de advertencia visual y decide el anfitrión.
- **Límite por local**: piloto con hasta 40 personas en cola un viernes;
  el sistema no impone tope (lo impone la realidad), pero el reporte debe
  poder mostrar el pico.

## 7. Supuestos (sin respuesta del diseñador)

1. **Llamado sin respuesta**: no se auto-cancela; el anfitrión decide
   (la mesa podría estar a 5 metros).
2. **Concurrencia de reorden**: last-write-wins.
3. **Aprobación de WhatsApp**: falla puede demorar → aviso in-app en el MVP.
4. **Datos móviles**: el comensal no depende del wifi del local; las vistas
   son livianas y toleran cortes (polling con retry).

## 8. Métricas de éxito del piloto

Del reporte diario: **unidos**, **sentados**, **sin sentarse**, **no
vinieron al llamado**, **espera media** y **pico de cola**. Objetivo del
piloto: reducir la gente que se va sin avisar y dar al anfitrión control
de la puerta — se valida con el reporte + conversación con los 3 locales.