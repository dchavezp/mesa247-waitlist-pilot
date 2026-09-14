# Convenciones de Código — Mesa247 Waitlist Pilot

> Reglas que aplican a todo el código de este proyecto. Los agentes/IA
> reciben este documento antes de escribir código.

## Regla central: código limpio y autoexplicativo

El código debe leerse como prosa: nombres que dicen qué hace la cosa,
funciones chicas con una sola responsabilidad, sin fricción innecesaria.

## Comentarios: solo cuando sean necesarios

- **El código explica el QUÉ.** Si necesitás un comentario para decir qué
  hace una línea, el nombre está mal o la función hace demasiado. Mejor
  refactorizá.
- **Los comentarios explican el POR QUÉ.** Se justifican cuando documentan
  una decisión no obvia que el código no puede expresar: un tradeoff, una
  restricción externa, un edge case raro, una elección entre alternativas.
- **Nunca**:
  - Comentarios que repiten el código (`# incrementa x` al lado de `x += 1`).
  - Código comentado: se borra, el historial de git lo guarda.
  - Bloques `TODO`/`FIXME` sin contexto de por qué y qué falta.
- **Docstrings**: solo en módulos/funciones públicas cuyo contrato no sea
  obvio del nombre y la firma. Los nombres buenos hacen innecesaria la
  mayoría de los docstrings.

## Ejemplo

```python
# ❌ Mal: repite el código
# suma 1 al contador
count += 1

# ✅ Bien: explica un "por qué" no obvio
# LWW: la tablet reenvía el orden completo; no hay merge ni contador de versión
# (decisión D3 — ver docs/mapeo-conversaciones.md)
position_index = request.order.index(entry_id)
```

## Frontend (`apps/web/`) — D29

- **Componentes custom**: la UI se arma con piezas propias y reutilizables en
  `src/components/` (botón, campo, tarjeta, modal). Sin librerías de UI con
  estilos propios; **Base UI** (`@base-ui/react`, D32) aporta primitivas
  *headless* accesibles (dialog, select, radio…) sin imponer look — el estilo
  siempre lo definen nuestros componentes y tokens. Si una pantalla repite
  markup, se extrae el componente.
- **SOLID aplicado a componentes y hooks**:
  - **S**: componente/función con una sola responsabilidad.
  - **O**: se extiende por props/composición, nunca modificando el comportamiento
    interno de un componente base.
  - **I**: interfaces de props chicas y específicas; nada de mega-props.
  - **D**: los componentes dependen de contratos tipados (hooks, cliente API),
    nunca de globals ni de detalles de implementación.
- **Theme con Tailwind**: todos los tokens viven en `src/index.css` vía `@theme`
  (Tailwind v4 — no hay config file). Se usan como clases utilitarias/tokens;
  nunca colores, medidas ni fuentes hardcodeadas en componentes.
- **Validaciones con Zod**: toda validación de entrada (formularios, params de
  ruta) se declara como schema Zod en el borde, integrado a React Hook Form vía
  `zodResolver`. Un schema por formulario; si el dato cruza a la API, el schema
  refleja el contrato tipado de `src/api/types.ts`.