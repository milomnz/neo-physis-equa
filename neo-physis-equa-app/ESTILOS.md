# Estilos estándar · Neo Physis Equa móvil

Cadenas de NativeWind que ya usa la app. **Copia de aquí, no inventes una
variante nueva.** Si algo se repite tres veces, se vuelve componente en
`src/components/`.

Regla base: primero busca el componente (`Button`, `Field`, `Select`,
`SearchBar`, `ChipFilter`, `Badge`). Solo si no existe, usa las clases sueltas
de este documento.

Fuente de verdad visual: `dist_styles.md`.

---

## Paleta (Light)

Tokens definidos en `tailwind.config.js`.

| Papel | Clase | Nota |
|---|---|---|
| Fondo de pantalla | `bg-crema` | Todas las pantallas |
| Superficie (tarjeta, barra) | `bg-white` o `bg-crema` | |
| Primario / acción | `bg-turquesa`, `text-crema` | CTA, header, chips activos |
| Borde interactivo | `border-turquesa` (2px), inactivo `border-turquesa/50` | |
| Texto fuerte | `text-noche` | Títulos y contenido |
| Texto secundario | `text-turquesa` | Subtítulos |
| Texto tenue / metadatos | `text-turquesa/70` | Fechas, ids |
| Placeholder | `<placeholderTextColor="#6B979A">` | Prop, no clase |
| Error | `text-red-600`, `bg-red-50`, `border-red-500` | Texto con `bg-red-700` en banner |
| Éxito | `bg-green-50 text-green-700` | Banner |

`accent` (#6B979A, token `accent`) es decorativo: placeholders y tracks de
switch inactivos. No se usa para texto informativo ni bordes (falla AA).

## Paleta (Alto Contraste / variante oscura)

Se lee de `useAccessibility()` → `palette`; **no hardcodees clases HC**.
Resumen de las variantes HC:

| Papel | Variante HC |
|---|---|
| Fondo de pantalla | `bg-noche` |
| Tarjeta | `bg-turquesa` + `border-2 border-crema` |
| Texto fuerte | `text-crema` |
| Texto secundario | `text-crema/80`, tenue `text-crema/60` |
| Chip activo / primario | `bg-crema` + `text-noche` |
| Error / éxito | `bg-red-950 text-red-300` / `bg-green-950 text-green-300` |
| Spinner / ActivityIndicator | `palette.spinner` (`#F3F4F4`) |

En modo claro el color de carga es `activityIndicatorColor="#17536D"` y en HC
`#F3F4F4`.

---

## Tipografía

- **Bricolage Grotesque** (`font-bricolage`): títulos de pantalla y sección,
  CTA y marca. Solo hay Bold (700) cargada.
- **Inter** (`font-inter`, `font-inter-semibold`, `font-inter-bold`): cuerpo,
  labels, chips y banners. Cargadas 400/600/700.
- No uses `font-bold`/`font-semibold` sueltos si quieres la familia correcta:
  usá siempre el token de peso (`font-inter-semibold`, etc.).

```tsx
<Text className="text-2xl font-bricolage text-noche">Título de pantalla</Text>
<Text className="text-lg font-bricolage text-noche">Título de tarjeta</Text>
<Text className="font-inter-semibold text-noche">Título de elemento</Text>
<Text className="text-turquesa">Subtítulo</Text>
<Text className="text-xs text-turquesa/70">Fecha, id</Text>
<Text className="font-inter-semibold text-noche">Label de campo</Text>
```

Todos usan `palette.<clave>` en vez de `text-noche` cuando la pantalla está
dentro de la sesión (ve `src/accessibility/context.tsx` para las claves de
`palette`). Las pantallas pre-login (`login`, `register`) usan tokens fijos.

---

## Contenedores

```tsx
// Pantalla simple
<View className="flex-1 gap-6 p-6 ${palette.bg}">

// Pantalla centrada (login, error)
<View className="flex-1 justify-center gap-5 p-6 ${palette.bg}">

// Pantalla con scroll (formularios largos)
<ScrollView
  className="flex-1 ${palette.bg}"
  contentContainerClassName="gap-5 p-6"
  keyboardShouldPersistTaps="handled">

// Tarjeta
<View className="gap-2 rounded-2xl border border-turquesa p-4 ${palette.card}">

// Cargando
<View className="flex-1 items-center justify-center ${palette.bg}">
  <ActivityIndicator color={palette.spinner} />
</View>
```

El espaciado entre hijos es `gap-*`, nunca `mt-*` en cada hijo.
`gap-6` entre bloques, `gap-5` entre campos, `gap-3`/`gap-2` dentro de una
tarjeta, `gap-1.5` entre etiqueta y control.

Bordes: interactivos `2px`, contenedores estructurales `1px`.

---

## Botón → usa `Button`

`src/components/Button.tsx` es **el** botón del proyecto. Altura mínima
`min-h-[48px]`.

```tsx
import Button from '../src/components/Button';

// Primario
<Button text="Registrar finca" onPress={handleSubmit(submit)} />

// Secundario (borde 2px turquesa, sin relleno)
<Button text="Volver" onPress={() => router.back()} secondary />

// Peligro (eliminar, cerrar sesión) → prop danger, no className
<Button text="Eliminar" onPress={handleDelete} danger />

// Deshabilitado mientras se envía: el texto también cambia
<Button
  text={saving ? 'Guardando…' : 'Guardar cambios'}
  onPress={handleSubmit(onSubmit)}
  disabled={saving}
/>
```

Props: `text`, `onPress`, `disabled?`, `secondary?`, `danger?`, `className?`.

Por dentro (referencia, no lo copies):

| Parte | Clases |
|---|---|
| Base | `min-h-[48px] items-center justify-center rounded-xl px-6 active:opacity-80 disabled:opacity-50` |
| Primario | `bg-turquesa` + texto `font-bricolage text-crema` |
| Secundario | `border-2 border-turquesa` + texto `font-bricolage text-noche` |
| Peligro | `border-2 border-red-500` + texto `font-bricolage text-red-600` |

Las variantes HC se resuelven por dentro (fondo crema / borde crema / texto
noche), no se pasan como `className`.

---

## Campo de texto → usa `Field`

`src/components/Field.tsx` ya trae etiqueta, foco con `border-noche`, borde rojo
al fallar y el mensaje de error. Solo dentro de un formulario de react-hook-form.

```tsx
<Field
  control={control}
  name="email"
  label="Correo"
  keyboardType="email-address"
  placeholder="nombre@autonoma.edu.co"
  rules={{
    required: 'El correo es obligatorio',
    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
  }}
/>
```

Input suelto (fuera de un formulario, como el buscador):

```tsx
<TextInput
  className="rounded-xl border-2 border-turquesa/50 bg-white p-3 text-noche"
  placeholderTextColor="#6B979A"
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
/>
```

Recuerda `placeholderTextColor` como **prop**, no como clase.

---

## Búsqueda → usa `SearchBar`

```tsx
import SearchBar from '../src/components/SearchBar';
<SearchBar value={query} onChangeText={setQuery} placeholder="Buscar…" />
```

Mismo comportamiento de foco que `Field`.

---

## Selección de una opción → usa `Select`

```tsx
<Select control={control} name="severity" label="Severidad" options={SEVERITIES} />
```

`Select` y `ChipFilter` son chips `rounded-full border-2`: activo
`bg-turquesa text-crema`, inactivo `bg-white border-turquesa text-noche`
(HC: activo `bg-crema text-noche`). Exponen `accessibilityRole="button"` y
`accessibilityState={{ selected }}`.

---

## Etiqueta de estado/prioridad → usa `Badge`

```tsx
<Badge value={crop.healthStatus} />
```

`Badge` consume `useAccessibility()` y tiene un mapa light/dark de colores por
valor. **Valor nuevo del backend ⇒ entrada nueva en el mapa de
`src/components/Badge.tsx`**, no un color en la pantalla.

---

## Errores del formulario completo

Un solo formato para el error que devuelve el servidor:

```tsx
{!!formState.errors.root && (
  <Text className={`rounded-lg p-3 text-center ${palette.errorBanner}`}>
    {formState.errors.root.message}
  </Text>
)}
```

Error que impide cargar la pantalla: `text-center ${palette.errorBanner}` + un
`<Button ... secondary />` para volver.

---

## Lista

```tsx
<FlatList contentContainerClassName="gap-3 p-4" ... />

// Fila pulsable
<Pressable className="gap-2 rounded-2xl border border-turquesa p-4 ${palette.card} active:opacity-80">

// Vacío o error
<Text className={`p-6 text-center ${palette.faint}`}>
```

---

## Enlace

```tsx
<Link href="/login" className="text-center text-turquesa">
```