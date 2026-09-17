# ESTILOS.md

Guía de clases de Tailwind para las pantallas de la aplicación.

Regla obligatoria: si una combinación de clases se repite tres veces, se vuelve
un componente en `src/components/`. En el proyecto de referencia eso ya pasó con
`Button`, `Field`, `Select` y `Badge`.

## 1. Paleta

| Rol | Clases |
| --- | --- |
| Fondo de pantalla | `bg-slate-900` |
| Superficie / card | `bg-slate-800` |
| Borde | `border-slate-700` |
| Label / texto secundario | `text-slate-300` / `text-slate-400` |
| Texto principal / títulos | `text-white` |
| Acento principal | `bg-blue-500` / `text-blue-400` |
| Error | `text-red-400` / `border-red-500` / `bg-red-500/10` |
| Éxito | `text-green-400` / `border-green-500` / `bg-green-500/10` |
| Placeholder | `placeholderTextColor="#64748b"` (slate-500) |

## 2. Contenedores de pantalla

| Uso | Clases |
| --- | --- |
| Pantalla base | `flex-1 bg-slate-900` |
| Pantalla centrada (home) | `flex-1 items-center justify-center bg-slate-900 px-6` |
| Formulario con scroll | `contentContainerClassName="flex-grow justify-center px-6 py-10"` en `ScrollView` |
| Loading | `flex-1 items-center justify-center bg-slate-900` + `ActivityIndicator color="#ffffff"` |

## 3. Tipografía

| Rol | Clases |
| --- | --- |
| Título de pantalla | `text-3xl font-bold text-white` |
| Subtítulo | `text-sm text-center text-slate-400` |
| Label de campo | `text-sm font-medium text-slate-300` |
| Texto de botón | `text-base font-semibold text-white` |
| Texto de enlace | `text-sm font-semibold text-blue-400` |
| Error de campo | `text-xs text-red-400` |

## 4. Formularios

| Elemento | Clases |
| --- | --- |
| Input | `rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-base text-white` |
| Botón primario | `items-center rounded-xl bg-blue-500 py-3.5 disabled:opacity-50` |
| Botón peligro (borrar) | `items-center rounded-xl border border-red-500 bg-red-500/10 px-6 py-3` |

Validaciones de referencia (coinciden con el backend):

| Campo | Regla |
| --- | --- |
| `nombre` | obligatorio, entre 2 y 100 caracteres |
| `email` | obligatorio, formato válido, máximo 150 caracteres |
| `password` | obligatorio, mínimo 6 caracteres |

## 5. Listas

| Uso | Clases |
| --- | --- |
| Card de item | `rounded-2xl border border-slate-700 bg-slate-800 p-4` |
| Fila de item | `flex-row items-center justify-between` |
| Badge | `rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400` |
| Texto de item | `text-base font-medium text-white` |
| Texto de detalle | `text-sm text-slate-400` |
| Barra de búsqueda | `rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-base text-white` |
| Empty state | `flex-1 items-center justify-center bg-slate-900` + `text-sm text-slate-400` |

## 6. Mensajes de error / éxito

| Uso | Clases |
| --- | --- |
| Error | `mb-4 rounded-xl border border-red-500 bg-red-500/10 p-3` + `text-center text-sm text-red-400` |
| Éxito | `mb-4 rounded-xl border border-green-500 bg-green-500/10 p-3` + `text-center text-sm text-green-400` |

## 7. Confirmación de borrado

Diálogo/confirmación antes de eliminar: alert del sistema operativo
(`Alert.alert`) con mensaje explícito, botón `Cancelar` y botón destructivo
`Eliminar`.

## 8. Componentes compartidos (`src/components/`)

Cuando una combinación de clases se repita tres veces, debe extraerse a un
componente. Componentes previstos (a implementar en su fase):

| Componente | Clases base |
| --- | --- |
| `Button` | variante primaria y de peligro de la sección 4 |
| `Field` | label + input + error de campo (secciones 3 y 4) |
| `Badge` | clase de badge de la sección 5 |
| `Alert` | mensajes de error/éxito de la sección 6 |