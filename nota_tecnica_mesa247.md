# NOTA TÉCNICA: SISTEMA DE LISTA DE ESPERA DIGITAL

**Candidato:** Dewitt Chavez
**Proyecto:** Piloto de Lista de Espera Digital (Mesa247)  
**Fecha:** Septiembre de 2026

---

### 1. Tres Preguntas para el Diseñador y Supuestos Asumidos

1. **¿Qué sucede si el comensal no responde ni se presenta a los 10 minutos de ser llamado?**
   * *Supuesto asumido:* La reserva no se auto-cancela en la base de datos para evitar remover por error a comensales que estén a pocos metros del local. En la tablet del anfitrión el estado del ticket cambia visualmente a un tono de advertencia ("Llamado excede tiempo") para que el anfitrión decida manualmente si cancela el turno o llama al siguiente.
2. **¿Cómo se debe resolver la concurrencia cuando dos anfitriones reordenan (`drag & drop`) la cola simultáneamente desde tablets distintas?**
   * *Supuesto asumido:* Se utiliza una estrategia de *last-write-wins* sobre la columna de orden `position_index`. La tablet reenvía el arreglo ordenado de IDs al servidor y este actualiza los índices. La otra tablet sincroniza el nuevo orden en la siguiente consulta de estado.
3. **¿Cómo manejamos las notificaciones si la aprobación de la plantilla de WhatsApp falla o se demora por políticas de Meta en algún país del piloto?**
   * *Supuesto asumido:* Para el MVP/Piloto, se reemplaza la dependencia de WhatsApp por **notificaciones *in-app*** en la misma vista móvil del comensal.

---

### 2. Alcance del Piloto: Qué se construye primero y qué se corta

#### Construido primero (MVP Core - 4 horas):
* **Comensal:** Formulario móvil de ingreso vía URL/QR (`Nombre`, `Teléfono`, `Comensales`). Roteo mediante `slug` del local (ej. `/join/la-terraza-azul-pe`).
* **Comensal:** Vista de estado con puesto en vivo, animación de avance, alerta *in-app* de "Mesa Lista" y botones de respuesta (*"Voy en camino"* / *"Ya no voy"*).
* **Anfitrión:** Vista de cola con cambio de estados (*Llamar*, *Sentar*, *Cancelar*) y modal para mostrar el código QR dinámico.
* **Infraestructura & Tooling:** API Stateless en FastAPI + React Frontend + MySQL. Gestión de entorno/paquetes con **`uv`** y ORM **SQLModel** para desacoplar y agilizar el desarrollo.

#### Cortado / Postergado para Fase 2:
* **Integración con WhatsApp Business API / Meta:** Postergado. Reemplazado por notificaciones *in-app*.
* **Reordenamiento complejo (`drag & drop`) UI pesado:** Reemplazado por botones simples de priorización/reordenamiento rápido en la tablet para reducir complejidad en la entrega.
* **Módulo Admin/Onboarding de Restaurantes:** Omitido. Se implementa un script de *data seeding* automático al iniciar la app para poblar los 3 locales del piloto (La Terraza Azul, Cuatro Vientos, Casa Mediterránea).
* **Reporte nocturno automático por e-mail:** Postergado. El reporte se puede consultar en un endpoint básico o vista de cierre, pero no se construye el worker de envío masivo de correos.

#### Estimación de tiempo (Desarrollo MVP):
* **Diseño del modelo de datos, script de seed de locales y setup con `uv` + SQLModel:** 45 min
* **Backend REST API en FastAPI (Endpoints comensal + anfitrión):** 1h 15 min
* **Frontend React (Vistas Comensal, Anfitrión y QR Modal):** 1h 30 min
* **Pruebas de flujo de punta a punta, README y documentación:** 30 min
* **Total estimado:** 4 horas.

---

### 3. Modelo de Datos (Esquema SQLModel / MySQL)

```sql
TABLE restaurants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL, -- D23: marca + país (ej. casa-mediterranea-cl), único global
    country_code VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TABLE queue_entries (
    id VARCHAR(36) PRIMARY KEY,
    restaurant_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    party_size INT NOT NULL,
    status ENUM('WAITING', 'NOTIFIED', 'SEATED', 'CANCELLED', 'NO_SHOW') DEFAULT 'WAITING',
    position_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notified_at TIMESTAMP NULL,
    seated_at TIMESTAMP NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

---

### 4. Feedback para el Diseñador (Devolución)

> *"Hola! Revisé el prototipo de 5 pantallas y está súper claro. Para asegurar que salgamos al piloto en el plazo previsto de 3 semanas (y reduzcamos costos operativos y de aprobaciones externas), sugiero hacer dos ajustes en la experiencia:*
> 
> 1. **Notificación en lugar de WhatsApp:** Para el piloto no dependeremos de las plantillas ni del costo por SMS/WhatsApp de Meta. Dado que el comensal ya mantiene la web abierta para ver su puesto en vivo, al momento de ser llamado la pantalla cambiará a un Banner Prominente con vibración/sonido para confirmar *"Voy en camino"*.
> 2. **Modal de QR en la Tablet del Anfitrión:** Agregamos un botón en el header de la tablet para desplegar un código QR. Si la entrada se llena o el cartel impreso de la puerta no está accesible, el anfitrión puede mostrárselo directamente al comensal en la tablet."*

---

### 5. Decisiones que NO se van a poder cambiar después (Arquitectura & Contratos)

1. **Estructura Stateless del Backend:** Toda la lógica de negocio depende de la persistencia directa en Base de Datos (MySQL con driver PyMySQL), evitando mantener estado global o hilos de Python en memoria dentro del contenedor. Esto garantiza que la app pueda correr en Cloud Run y escalar a múltiples instancias sin causar inconsistencias entre clientes.
2. **Estrategia de Sincronización (Short Polling resiliente vs WebSockets):** Se opta por *Short Polling* (consultas HTTP GET repetidas cada 5 a 8 segundos con cabeceras de caché). En redes móviles inestables (como las entradas de restaurantes), el polling con reconexión nativa es infinitamente más estable y tolerante a fallos que conexiones persistentes como WebSockets o SSE sobre Cloud Run.
3. **Roteo Multi-tenant por Slug:** Todas las URLs públicas e internas se estructuran mediante el parámetro `/join/{restaurant_slug}` o `/host/{restaurant_slug}`, desacoplando la interfaz de usuario de los IDs internos de la BD y facilitando el escalado futuro a 150 locales.

---

### 6. Despliegue en Producción, Monitoreo y Gestión de Incidentes

* **Despliegue (GCP Cloud Run + MySQL / Cloud SQL):**
  * La aplicación se encapsula en un contenedor Docker liviano utilizando `uv` para compilar un entorno virtual aislado (Python FastAPI en el backend y Nginx sirviendo la build de React en el frontend).
  * Cloud Run gestionará el autoscaling (mínimo 1 instancia activa para evitar *cold starts* en horas pico de viernes).
* **Alarmas y Métricas Primarias:**
  * **Google Cloud Monitoring:** Alerta mediante PagerDuty/Slack si la tasa de errores HTTP `5xx` supera el 2% en un ventana de 5 minutos.
  * **Health Check Endpoint:** Endpoint `/health` que valida la conectividad con la base de datos MySQL. Si falla, el balanceador redirige el tráfico o levanta una nueva instancia.
* **Respuesta a Caída un Viernes a las 9:00 PM:**
  1. **Notificación:** Recibo la alerta vía PagerDuty por degradación del servicio o picos de latencia.
  2. **Diagnóstico Rápido:** Revisión de logs estructurados en **Cloud Logging** filtrando por severidad `ERROR`.
  3. **Plan de Contención:** 
     * Si es un problema de saturación de la BD por polling, incrementar el tiempo de polling de los clientes dinámicamente desde la respuesta del backend (ej. pasar de 5s a 15s).
     * Si es un bug introducido en el último release, realizar un *rollback* inmediato a la versión previa en Cloud Run con un solo clic en la consola o CLI.