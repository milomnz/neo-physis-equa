# Diccionario de Estilos (AgroPhysis)

Este documento define las bases visuales del proyecto, priorizando la legibilidad y el alto contraste para cumplir con los requerimientos de accesibilidad de la aplicación.

## Tipografía

El proyecto utiliza una combinación de dos familias tipográficas, optimizadas para lectura en pantallas móviles y tecnologías de asistencia, aportando claridad y carácter.

* **Inter (Sans Serif):**
  * **Uso principal:** Cuerpo de texto (body), párrafos, descripciones de plagas, instrucciones de tratamientos y etiquetas de accesibilidad.
  * **Justificación:** Su excelente legibilidad en tamaños pequeños y su diseño neutro la hacen ideal para asegurar la comprensión en usuarios con visión reducida o discapacidad cognitiva.
* **Bricolage Grotesque:**
  * **Uso principal:** Encabezados (H1, H2, H3), títulos de pantallas, botones principales y tarjetas de diagnóstico.
  * **Justificación:** Su geometría expresiva y alto impacto visual proporcionan una jerarquía clara y un contraste estructural fuerte frente al cuerpo de texto, mejorando la navegación rápida y escaneable.

## Paleta de Colores

El esquema de colores se compone de cuatro tonos extraídos directamente de la paleta base[cite: 3], estructurados para soportar un modo claro (Light Mode) nativo y mantener las normativas de alto contraste.

| Muestra Visual | Hexadecimal (Aprox) | Nombre Sugerido (Tailwind) | Uso Principal en la UI |
| :--- | :--- | :--- | :--- |
| **Azul Noche Profundo** | `#011824` | / `text-primary` | Texto principal, títulos, modo oscuro (fondos), alto contraste. |
| **Azul turquesa oscuro** | `#17536D` | / `bg-primary` | Barras de navegación (Header), botones de acción principal (CTA), íconos destacados. |
| **Verde Turquesa** | `#6B979A` | / `accent` | Texto de placeholder, rieles (tracks) inactivos de switches, acentos decorativos. *(Su ratio de contraste (~2.9:1) no alcanza AA, por eso no se usa en texto informativo ni bordes: los CTA y bordes utilizan turquesa o noche.)* |
| **Beige** | `#F3F4F4` | / `bg-base` | Fondo general de la aplicación, fondo interior de tarjetas (Cards), contenedores de entrada de texto. |

Para garantizar la accesibilidad táctil y visual, la interfaz adoptará un estilo "Flat" (plano) con bordes sólidos y definidos, minimizando el uso de sombras difusas.

### Geometría Base (Bordes y Esquinas)
*   **Grosor de bordes (Border Width):** `2px` para elementos interactivos (botones secundarios, inputs) y `1px` para contenedores estructurales.
*   **Redondeo de esquinas (Border Radius):** 
    *   Componentes interactivos (Botones, Inputs): `12px` (`rounded-xl`).
    *   Contenedores grandes (Tarjetas, Modales): `16px` o `24px` (`rounded-2xl` o `rounded-3xl`).

### 1. Botones y Áreas Táctiles
Todo elemento interactivo debe tener una altura mínima de **48px**. Esta métrica se alinea con las guías de Material Design de Android y supera los estándares de accesibilidad WCAG 2.1 nivel AAA (44x44px) y WCAG 2.2 nivel AA (24x24px), garantizando un uso cómodo para personas con discapacidad motora.

*   **Botón Principal (Primary Action):**
    *   Fondo: Azul Turquesa Oscuro (`bg-turquesa`).
    *   Texto: Beige (`text-crema`).
    *   Fuente: Bricolage Grotesque, Bold, 16px o 18px.
    *   Altura: `48px` mínimo (`min-h-[48px]`).
*   **Botón Secundario / Outline:**
    *   Fondo: Transparente o Beige (`bg-crema`).
    *   Texto: Azul Noche Profundo (`text-noche`).
    *   Borde: `2px` sólido, color Azul Turquesa Oscuro (`border-turquesa`). *(Nota: Se utiliza el turquesa para garantizar un ratio de contraste superior a 3:1 para componentes de UI).*

### 2. Tarjetas (Cards)
*   Fondo interior: Beige (`bg-crema`) o Blanco absoluto.
*   Borde: `1px` sólido, color Azul Turquesa Oscuro (`border-turquesa`) o Azul Noche (`border-noche` con opacidad).
*   Padding interior: `16px` o `20px`.

### 3. Entradas de Texto (Inputs)
*   Fondo: Blanco o Beige (`bg-crema`).
*   Borde inactivo: `2px` sólido, color Azul Turquesa Oscuro (`border-turquesa/50`).
*   Borde activo (Focus): `2px` sólido, color Azul Noche Profundo (`border-noche`).
*   Etiqueta (Label): Siempre visible fuera del input, fuente Inter, 14px, color Azul Noche Profundo (`text-noche`).