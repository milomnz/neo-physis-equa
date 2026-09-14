# Neo-Physis-Equa 🌱♿

**Neo-Physis-Equa** es una plataforma de **inclusión agrícola accesible** diseñada para empoderar a pequeños productores y trabajadores del campo, permitiendo la **incorporación productiva de personas con discapacidad** (visual, motora, auditiva e intelectual). La plataforma utiliza técnicas de visión por computador e Inteligencia Artificial mediante la cámara del dispositivo móvil para la **predicción y diagnóstico oportuno de plagas en cultivos**.

---

## 🎯 Contexto e Impacto Social

En las comunidades rurales, las barreras de accesibilidad digital y física suelen excluir a personas con capacidades diversas de la gestión agronómica. **Neo-Physis-Equa** elimina estas barreras mediante una arquitectura diseñada bajo principios universales de accesibilidad (WCAG 2.1 AA/AAA) combinada con modelos fitosanitarios adaptados a las condiciones geográficas de cada terreno.

---

## 🗄️ Arquitectura de Base de Datos (PostgreSQL)

El sistema backend está construido sobre **NestJS** y utiliza **PostgreSQL** mediante **TypeORM** como motor de base de datos relacional. 

### Principales decisiones de diseño de datos:
- **Identificadores Únicos Universales (UUID v4)**: Se emplean llaves primarias de tipo UUID para garantizar la interoperabilidad sincrónica y asincrónica entre dispositivos móviles y servidores.
- **Relaciones Relacionales**: Enlaces estrictos entre usuarios (`User`) y propiedades agrícolas (`Farm`) con integridad referencial y borrado en cascada configurado (`CASCADE`).
- **Campos Geoespaciales y JSONB**: Almacenamiento flexibilizado del campo `location` mediante formato `JSONB` de PostgreSQL, facilitando la consulta de datos de vereda, municipio, departamento y coordenadas GPS (`latitude`, `longitude`).

---

## ♿ Manejo de Niveles de Accesibilidad

La aplicación móvil (`neo-physis-equa-app`) cuenta con un perfil dinámico de accesibilidad que ajusta la interfaz de usuario en tiempo real según las necesidades específicas:

| Discapacidad | Adaptaciones y Funcionalidades |
|---|---|
| **Visual** 👁️ | • Síntesis de Voz (Text-to-Speech / TTS) para lectura de diagnósticos.<br>• Etiquetas explícitas para lectores de pantalla (`accessibilityLabel`, `accessibilityHint`).<br>• Modo de Alto Contraste con paletas cromáticas accesibles.<br>• Ajuste dinámico de escala de fuentes. |
| **Motora** 🖐️ | • Botones y áreas de toque ampliadas (mínimo 48x48 dp).<br>• Flujos de navegación simplificados con un solo toque.<br>• Atajos por comandos de voz para captura de fotos y registro de fincas. |
| **Auditiva** 👂 | • Alertas visuales con código de colores e íconos universales.<br>• Indicadores gráficos en vivo durante el escaneo con la cámara.<br>• Confirmaciones háticas (vibración) para acciones completadas. |
| **Intelectual** 🧠 | • Vocabulario agrícola simplificado y claro.<br>• Guía interactiva paso a paso para la toma de muestras de cultivo.<br>• Iconografía descriptiva con alto apoyo visual. |

---

## 🌾 Descripción de la Entidad: Finca (`Farm`)

La primera entidad de dominio registrada en el sistema es la **Finca (`Farm`)**, que actúa como el ancla de contextualización agroclimática. La altitud y la ubicación geográfica son variables críticas para los algoritmos de predicción de plagas y enfermedades vegetales.

### Esquema de la Entidad `Farm`

```
┌──────────────────────────────────────────────────────────────┐
│                            User                              │
├──────────────────────────────────────────────────────────────┤
│ id: string (UUID)                                            │
│ name: string                                                 │
│ email: string                                                │
│ disabilityType: Enum (motora | visual | auditiva | ...)      │
└──────────────────────────────┬───────────────────────────────┘
                               │ 1
                               │
                               │ *
┌──────────────────────────────▼───────────────────────────────┐
│                            Farm                              │
├──────────────────────────────────────────────────────────────┤
│ id: string (UUID)                                            │
│ ownerId: string (FK -> User.id)                              │
│ name: string (ej. "Finca El Paraíso")                        │
│ location: JSONB { vereda, municipio, departamento, coords }   │
│ altitude: number (metros sobre el nivel del mar - m.s.n.m.)   │
│ createdAt: Timestamp                                         │
│ updatedAt: Timestamp                                         │
└──────────────────────────────────────────────────────────────┘
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` (String) | Identificador único primario de la finca. |
| `ownerId` | `UUID` (Ref → `User`) | Identificador del agricultor o propietario de la finca. |
| `name` | `String` | Nombre asignado a la finca (ej. *"Finca La Esperanza"*). |
| `location` | `JSONB` / Geo | Datos estructurados de localización (vereda, municipio, departamento, lat/lng). |
| `altitude` | `Number` | Altitud en metros sobre el nivel del mar (m.s.n.m.), indispensable para determinar temperatura media y presión que condicionan la propagación de plagas. |

---

## 🛠️ Estructura del Repositorio

- `neo-physis-equa-backend/`: Servidor API REST desarrollado en NestJS con TypeORM y PostgreSQL.
- `neo-physis-equa-app/`: Aplicación móvil desarrollada en React Native / Expo con soporte NativeWind y accesibilidad integral.
