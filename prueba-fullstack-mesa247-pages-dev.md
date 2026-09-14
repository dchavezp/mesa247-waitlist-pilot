Qué es esto

Un encargo como el que te llegaría un lunes, y la decisión de qué construir primero.

En este puesto vas a tomar ideas y prototipos de nuestro Lead Product Designer y llevarlos a producción de principio a fin, muchas veces solo. Esta prueba es eso, en pequeño: te pasamos un encargo tal cual nos llegaría, con más cosas de las que caben en el plazo, y tú decides qué se construye, qué se corta y qué se le devuelve al diseñador.

Quien construye solo toma cien decisiones por semana y nadie se las revisa. Casi todas se pueden deshacer, y hay que tomarlas rápido. Unas pocas no, y hay que tomarlas despacio. Queremos ver si distingues unas de otras.

La IA te puede generar el prototipo entero en una tarde. Lo que no puede es decirte cuál de esas cinco pantallas va primero, qué hay que preguntarle al diseñador antes de escribir una línea, y qué parte de todo esto no vas a poder cambiar después.

Eso es lo que evaluamos.

Cómo se juega

## Seis reglas

01

#### Cuatro horas de trabajo, entrega hasta el viernes

La prueba está pensada para cuatro horas y así la vamos a leer. Entrégala como máximo el **viernes 18 de septiembre a las 12:00 del mediodía, hora de Lima**. Si necesitas más tiempo, avísanos antes del plazo.

02

#### Tres preguntas para el diseñador

No vas a poder hablar con el diseñador: el encargo es todo lo que hay. En tu nota, escribe **las tres preguntas que le harías antes de empezar** y qué asumiste para cada una al no tener respuesta.

Qué eliges preguntar dice mucho de cómo abordas un problema nuevo.

03

#### No construyas todo

Construye el corte que sacarías primero a producción y cuéntanos qué harías con el resto. **Si nos llega el prototipo completo funcionando, lo leemos como que no elegiste.**

04

#### Usa IA sin límite — y mándanos los chats

ChatGPT, Claude, Copilot, Cursor, lo que uses a diario. Sin restricciones. Esas conversaciones **son parte de la entrega**; más abajo explicamos por qué.

05

#### Donde falte información, asume y escríbelo

El encargo tiene huecos, como cualquier pedido real, y no habrá nadie para llenarlos. **Un supuesto razonable y explícito vale tanto como una respuesta**: déjalo escrito en la nota.

06

#### La prueba no decide

Decide la conversación de después: 45 minutos sobre lo que construiste, sin herramientas delante, defendiendo cada corte y cada decisión. **Entrega solo lo que puedas sostener tú.**

La entrega

## Cuatro cosas

Sin capturas ni presentaciones.

Entregable 1

#### La nota técnica

Una o dos páginas. Sin plantilla, pero que responda:

- **Las tres preguntas que le harías al diseñador**, y qué asumiste para cada una.
- **Qué construyes primero y qué cortas**, con una estimación para cada parte.
- **El modelo de datos**, aunque sea un esquema a mano.
- **Qué le devolverías al diseñador**, y cómo se lo dirías.
- **Qué decisiones no se van a poder cambiar después.**
- **Cómo lo llevarías a producción**: el despliegue, qué alarma pones y cómo te enteras si se cae un viernes a las 9 de la noche.

Entregable 2

#### El corte funcionando

Un repositorio con **FastAPI** y **React**. Lo mínimo de punta a punta: un comensal se une a la cola, el anfitrión la ve y llama al siguiente.

Un README con lo necesario para levantarlo en cinco minutos. Tests solo de lo que importa.

GitHub o GitLab, público o con acceso para talento@mesa247.pe.

MySQL o SQLite para correrlo en local, lo que te sea más rápido.

Entregable 3

#### Tus conversaciones con la IA

Si usaste un asistente, mándanos las conversaciones **separadas por parte**: la nota, el backend, el frontend. Completas, tal cual salieron, sin editarlas.

Un enlace para compartir por chat, la exportación, o pegadas como anexo con un título por parte.

Si alguna tiene cosas personales o de otro trabajo, recórtalas y dínoslo.

Entregable 4

#### Algo que construiste tú

Diez líneas sobre algo que construiste —idealmente solo— y que llegó a producción: **qué cortaste, qué salió mal y qué harías distinto.**

No tiene que ser grande ni exitoso. Nos interesa más lo que salió mal.

Por qué pedimos los chats

## Porque el código ya no dice cómo pensaste

Dos candidatos pueden entregarnos el mismo repositorio funcionando. Uno le fue diciendo a la IA qué no hacer; el otro aceptó todo lo que le propuso. En el código se parecen. En la conversación no.

Construyendo solo, el modelo te va a proponer todos los días más de lo que necesitas —el WebSocket, la librería extra, la abstracción por si acaso— y te lo va a proponer bien escrito. **El criterio está en lo que le dices que no**, y eso solo se ve en la conversación.

Cuando la leemos, buscamos seis cosas:

- Por dónde empezaste¿Por el código, por los datos o por las preguntas? Ahí se ve cómo abordas un problema nuevo.
- Qué le dijiste que noLo que te propuso y rechazaste, y con qué argumento.
- Dónde no te lo creísteUn «espera, ¿y qué pasa si…?» vale más que diez respuestas aceptadas.
- Qué fuiste a buscarEl contexto que pediste sin que te lo ofrecieran dice cuánta cancha tienes.
- Quién llevaba el timónSi tú lo dirigías hacia un objetivo o si te fue llevando él.
- Cuándo parasteDecidir que algo ya está bien para la primera versión es la decisión que vas a tomar acá cada semana.

#### Y para que quede claro

Usar mucho la IA no resta.No medimos cuánto la usaste ni contamos prompts. Quien la usa a fondo y sabe auditar lo que recibe nos interesa más que quien no la usa.

No hace falta que se vea bien.Nadie escribe prompts bonitos trabajando. Los callejones sin salida y las correcciones a mitad de camino son justo lo que queremos ver.

Si no usaste IA, perfecto.Dilo en una línea, sin penalización.

No es para pillarte.No hay detector ni comparación automática. Lo leemos una persona y tú, para conversarlo en la entrevista.

La vara

## Qué evaluamos

Criterio técnico, capacidad de ejecución y mentalidad de producto.

#### Sí

- **Qué eliges construir primero**, y qué dejas fuera con argumentos.
- Si distingues las decisiones que se pueden deshacer de las que no.
- Si le devuelves al diseñador lo que no conviene, y cómo se lo dices.
- Si tu corte funciona de punta a punta y se levanta con el README.
- Si lo que queda expuesto al público está pensado para el público.
- Si tus tests cubren lo que se rompe, no lo que se ve.
- Si estimas con números y dices de qué dependen.
- **Si se te nota la cancha.** A quien ya puso algo en producción se le nota en lo que le preocupa.

#### No

- Que se vea como el prototipo. No hay que replicarlo pixel a pixel.
- Que esté completo.
- Cuánto usaste la IA.
- Qué librerías elegiste, mientras puedas explicar por qué.
- Docker, CI o infraestructura como código. Si lo haces, bien; si no, cuéntanos cómo lo harías.

El envío

## Cómo y cuándo

Para[talento@mesa247.pe](mailto:talento@mesa247.pe)AsuntoEl encargo — Nombre ApellidoAdjuntasLa nota técnica, el enlace al repositorio, tus conversaciones con la IA y tus diez líneas. Si no usaste IA, dilo en una línea.PlazoViernes 18 de septiembre, 12:00 del mediodía (hora de Lima)

Si necesitas más tiempo, avísanos antes del plazo, a este mismo correo.

## El encargoLista de espera digital

Te llega este mensaje un lunes a las 10 de la mañana.

PD

Lead Product Designer

Mesa247 · Producto

lun 10:04

¡Hola! Te paso esto. Los restaurantes con mucho walk-in tienen los viernes colas de 30 a 40 personas en la puerta, anotadas en un cuaderno. Se pierden nombres, la gente se va sin avisar y el anfitrión no da abasto. Queremos una lista de espera digital:

1. El comensal escanea un QR en la puerta, pone su nombre, su teléfono y cuántos son, y entra a la cola.
2. En su celular ve su posición en vivo —que baja con una animación cuando avanza la cola— y un tiempo estimado de espera.
3. Cuando su mesa está lista le llega un WhatsApp con dos botones: «Voy en camino» y «Ya no voy».
4. El anfitrión ve la cola en su tablet, puede arrastrar para reordenar (a veces priorizan a un cliente frecuente) y toca «Llamar».
5. Al cierre del día, un reporte: cuánta gente se fue sin sentarse.

Te adjunto el prototipo, son cinco pantallas. Es para un piloto con tres locales —La Terraza Azul y Cuatro Vientos en Lima, y Casa Mediterránea en Santiago— en tres semanas. ¿Qué necesitas?

Adjunto · prototipo-lista-de-espera · 5 pantallas

### El prototipo

1 · Comensal — Unirse

La Terraza Azul

Lista de espera · hoy

Nombre

Carla

Teléfono

+51 987 654 321

¿Cuántos son?

–  4  +

Unirme a la cola

se abre al escanear el QR de la puerta

2 · Comensal — Tu turno

Estás en el puesto

7

Tiempo estimado

≈ 25 min

Te avisaremos por WhatsApp cuando tu mesa esté lista

Ya no voy

el número baja en vivo, con animación

3 · Comensal — WhatsApp

Mesa247

Cuenta de empresa

¡Carla, tu mesa en La Terraza Azul está lista! Tienes 10 minutos para acercarte a la entrada.21:14

Voy en camino

Ya no voy

los botones actualizan la cola del anfitrión

4 · Anfitrión — La cola, en la tablet

La Terraza Azul · viernes12 en cola · espera media 31 min

⋮⋮ **1** Carla M.4 pers.34 minLlamar

⋮⋮ **2** Jorge P.2 pers.31 minFrecuenteLlamar

⋮⋮ **3** Familia Rojas6 pers.28 minLlamado 21:12Sentar

⋮⋮ **4** Andrés V.2 pers.22 minLlamar

⋮⋮ **5** Lucía y Ana2 pers.15 minLlamar

arrastrar ⋮⋮ para reordenar · «Llamar» envía el WhatsApp

5 · Reporte del día

Viernes 11 de septiembre

La Terraza Azul · cierre del día

Se unieron **142**

Se sentaron **97**

Se fueron sin sentarse **31**

No vinieron al ser llamados **14**

Espera media **34 min**

llega por correo al cierre

### Lo que sabes del sistema

StackPython y **FastAPI** en el backend, **React con TypeScript** en el frontend, **MySQL**. Todo corre en Google Cloud, sobre Cloud Run.

PaísesPerú, Chile, Ecuador y Colombia. Este piloto: dos locales en Lima y uno en Santiago.

El Libro**El sistema que ya usan los restaurantes.** Más antiguo, escrito en PHP. Tiene los locales, sus mesas y sus reservas. También tiene una lista de espera que casi nadie usa: exige iniciar sesión y pasar por cuatro pantallas.

AnfitrionesUsan tablets compartidas en la entrada. Los viernes hay dos atendiendo a la vez.

La puertaEl wifi es malo. El comensal usa sus datos móviles.

WhatsAppHay una cuenta de WhatsApp Business. Los mensajes que inicia el negocio necesitan plantillas aprobadas por Meta —que a veces las rechaza— y se cobran por mensaje, con una tarifa distinta por país. También hay un proveedor de SMS contratado.

EscalaTres locales en el piloto, con hasta 40 personas en cola por local un viernes. Si funciona, la idea es llevarlo a **150 locales en tres meses**.

#### Tu tarea

Decide qué sale primero a producción para el piloto, constrúyelo, y cuéntanos el resto en la nota técnica. Los cuatro entregables están arriba, en [La entrega](https://prueba-fullstack-mesa247.pages.dev/#entrega).