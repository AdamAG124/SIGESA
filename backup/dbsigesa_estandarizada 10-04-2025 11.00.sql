-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-04-2025 a las 19:00:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dbsigesa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_categoria_producto`
--

CREATE TABLE `sigm_categoria_producto` (
  `ID_CATEGORIA_PRODUCTO` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_DESCRIPCION` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_categoria_producto`
--

INSERT INTO `sigm_categoria_producto` (`ID_CATEGORIA_PRODUCTO`, `DSC_NOMBRE`, `DSC_DESCRIPCION`, `ESTADO`) VALUES
(1, 'Electrónica', 'Dispositivos electrónicos y accesorios', 0),
(2, 'Hogar', 'Productos para el hogar y cocina', 1),
(3, 'Juguetería', 'Juguetes y artículos para niños', 0),
(4, 'Ropa', 'Ropa y accesorios de moda', 1),
(5, 'Deportes', 'Equipamiento y ropa deportiva', 0),
(6, 'Belleza', 'Productos de belleza y cuidado personal', 1),
(7, 'Automotriz', 'Accesorios y piezas de automóviles', 0),
(8, 'Jardinería', 'Herramientas y productos de jardinería', 1),
(9, 'Oficina', 'Artículos de papelería y oficina', 1),
(10, 'Mascotas', 'Productos y alimentos para mascotas', 1),
(11, 'Electrodomésticos', 'Aparatos electrodomésticos', 1),
(12, 'Muebles', 'Mobiliario para hogar y oficina', 1),
(13, 'Ferretería', 'Herramientas y artículos de ferretería', 1),
(14, 'Libros', 'Libros y artículos de lectura', 1),
(15, 'Videojuegos', 'Consolas y videojuegos', 1),
(16, 'Computación', 'Computadoras y accesorios de tecnología', 1),
(17, 'Salud', 'Productos de salud y bienestar', 1),
(18, 'Instrumentos Musicales', 'Instrumentos musicales y accesorios', 1),
(19, 'Fotografía', 'Cámaras y accesorios fotográficos', 1),
(20, 'Bebés', 'Artículos para bebés y maternidad', 1),
(21, 'Frutas', 'Todo tipo de frutas', 1),
(22, 'Verduras', 'Todo tipo de verduras', 0),
(23, 'Vegetales', 'Todo tipo de vegetales que sean comestibles', 1),
(24, 'Granos', 'Todo tipo de granos, como el arroz.', 1),
(25, 'Calzado', 'Todo tipo de zapatos, sandalias y más.', 1),
(26, 'Hogar', 'Productos electronicos', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_colaborador`
--

CREATE TABLE `sigm_colaborador` (
  `ID_COLABORADOR` int(11) NOT NULL,
  `ID_DEPARTAMENTO` int(11) DEFAULT NULL,
  `ID_PUESTO` int(11) DEFAULT NULL,
  `DSC_SEGUNDO_APELLIDO` varchar(255) DEFAULT NULL,
  `FEC_NACIMIENTO` date DEFAULT NULL,
  `NUM_TELEFONO` varchar(20) DEFAULT NULL,
  `FEC_INGRESO` date DEFAULT NULL,
  `FEC_SALIDA` date DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL,
  `DSC_CORREO` varchar(255) DEFAULT NULL,
  `DSC_CEDULA` varchar(20) DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_PRIMER_APELLIDO` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_colaborador`
--

INSERT INTO `sigm_colaborador` (`ID_COLABORADOR`, `ID_DEPARTAMENTO`, `ID_PUESTO`, `DSC_SEGUNDO_APELLIDO`, `FEC_NACIMIENTO`, `NUM_TELEFONO`, `FEC_INGRESO`, `FEC_SALIDA`, `ESTADO`, `DSC_CORREO`, `DSC_CEDULA`, `DSC_NOMBRE`, `DSC_PRIMER_APELLIDO`) VALUES
(1, 1, 1, 'GONZALEZ', '2001-08-25', '+506 6313-3860', '2022-09-01', NULL, 1, 'adam.acuna.gonzalez@est.una.ac.cr', '118200907', 'ADAM', 'ACUÑA'),
(2, 2, 3, 'Gómez', '2001-10-16', '85218760', '2022-09-01', NULL, 1, 'karolayvargasg@gmail.com', '5461623101989', 'Karolay', 'Vargas'),
(3, 3, 2, 'Ramírez', '1990-07-15', '62452341', '2021-06-12', NULL, 1, 'lucia.ramirez@empresa.com', '109876543', 'Lucía', 'Pérez'),
(4, 1, 1, 'Vargas', '1985-09-30', '63214578', '2020-05-01', NULL, 0, 'juan.vargas@empresa.com', '234567890', 'Juan', 'Gómez'),
(5, 3, 2, 'Rodríguez', '1993-01-10', '61543298', '2022-07-20', NULL, 1, 'maria.rodriguez@empresa.com', '345678901', 'María', 'Lopez'),
(6, 1, 1, 'Sánchez', '1992-12-15', '62341257', '2023-01-15', NULL, 1, 'diego.sanchez@empresa.com', '456789012', 'Diego', 'Hernández'),
(7, 1, 1, 'Guzmán', '1988-04-22', '62134679', '2021-09-10', NULL, 1, 'andrea.guzman@empresa.com', '567890123', 'Andrea', 'Martínez'),
(8, 1, 1, 'Mejía', '1989-11-03', '62547812', '2020-12-05', NULL, 0, 'carlos.mejia@empresa.com', '678901234', 'Carlos', 'Jiménez'),
(9, 1, 1, 'Solís', '1991-02-14', '62014567', '2021-03-17', NULL, 1, 'diana.solis@empresa.com', '789012345', 'Diana', 'García'),
(10, 1, 1, 'Rojas', '1995-06-29', '62894312', '2022-04-09', NULL, 1, 'fernando.rojas@empresa.com', '890123456', 'Fernando', 'Castro'),
(11, 1, 1, 'Pacheco', '1994-10-18', '62983451', '2023-02-11', NULL, 0, 'ana.pacheco@empresa.com', '901234567', 'Ana', 'Vega'),
(12, 1, 1, 'Valverde', '1987-08-24', '61983745', '2019-11-22', NULL, 1, 'roberto.valverde@empresa.com', '912345678', 'Roberto', 'Chacón'),
(13, 1, 1, 'Mora', '1996-03-27', '62674930', '2022-06-14', NULL, 1, 'sofia.mora@empresa.com', '923456789', 'Sofía', 'Ortega'),
(14, 1, 1, 'Arias', '1992-05-12', '61734982', '2023-05-21', NULL, 1, 'gabriel.arias@empresa.com', '934567890', 'Gabriel', 'Monge'),
(15, 1, 1, 'García', '1993-07-08', '62245839', '2021-08-02', NULL, 1, 'raquel.garcia@empresa.com', '945678901', 'Raquel', 'Alvarado'),
(16, 1, 1, 'Zamora', '1986-09-19', '62493817', '2020-09-23', NULL, 0, 'esteban.zamora@empresa.com', '956789012', 'Esteban', 'Vargas'),
(17, 1, 1, 'Murillo', '1989-10-11', '62983721', '2021-10-13', NULL, 1, 'karla.murillo@empresa.com', '967890123', 'Karla', 'Rodríguez'),
(18, 1, 1, 'Castillo', '1990-11-25', '61834972', '2022-11-01', NULL, 1, 'daniel.castillo@empresa.com', '978901234', 'Daniel', 'Navarro'),
(19, 1, 1, 'Cordero', '1984-04-15', '61634892', '2019-01-29', NULL, 1, 'alicia.cordero@empresa.com', '989012345', 'Alicia', 'Torres'),
(20, 1, 1, 'Fernández', '1991-05-05', '61435982', '2020-03-14', NULL, 1, 'pablo.fernandez@empresa.com', '990123456', 'Pablo', 'Cruz'),
(21, 1, 1, 'Esquivel', '1993-12-23', '62038495', '2021-12-07', NULL, 1, 'monica.esquivel@empresa.com', '991234567', 'Mónica', 'Méndez'),
(22, 1, 1, 'ALFARO', '1997-02-06', '12345678', NULL, NULL, 1, 'adan@gmail.com', '503930363', 'ADAN FRANCISCO', 'CARRANZA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_comprobante_pago`
--

CREATE TABLE `sigm_comprobante_pago` (
  `ID_COMPROBANTE_PAGO` int(11) NOT NULL,
  `ID_ENTIDAD_FINANCIERA` int(11) DEFAULT NULL,
  `FEC_PAGO` date DEFAULT NULL,
  `NUM_COMPROBANTE_PAGO` varchar(255) DEFAULT NULL,
  `MONTO_COMPROBANTE_PAGO` double DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_comprobante_pago`
--

INSERT INTO `sigm_comprobante_pago` (`ID_COMPROBANTE_PAGO`, `ID_ENTIDAD_FINANCIERA`, `FEC_PAGO`, `NUM_COMPROBANTE_PAGO`, `MONTO_COMPROBANTE_PAGO`, `ESTADO`) VALUES
(1, 1, '2023-01-10', 'CP-2023-001', 1500.75, 1),
(2, 2, '2023-01-15', 'CP-2023-002', 800, 1),
(3, 3, '2023-02-01', 'CP-2023-003', 600.25, 1),
(4, 4, '2023-02-10', 'CP-2023-004', 1200.5, 1),
(5, 5, '2023-02-20', 'CP-2023-005', 300, 1),
(6, 6, '2023-03-05', 'CP-2023-006', 1800, 1),
(7, 7, '2023-03-15', 'CP-2023-007', 900.5, 1),
(8, 8, '2023-03-25', 'CP-2023-008', 1100, 1),
(9, 9, '2023-04-01', 'CP-2023-009', 750.25, 1),
(10, 10, '2023-04-10', 'CP-2023-010', 2000, 1),
(11, 1, '2023-04-15', 'CP-2023-011', 950.75, 1),
(12, 2, '2023-04-20', 'CP-2023-012', 1300, 1),
(13, 3, '2023-05-01', 'CP-2023-013', 450.5, 1),
(14, 4, '2023-05-10', 'CP-2023-014', 1600.25, 1),
(15, 5, '2023-05-15', 'CP-2023-015', 700, 1),
(16, 6, '2023-05-20', 'CP-2023-016', 850.5, 1),
(17, 7, '2023-06-01', 'CP-2023-017', 1400, 1),
(18, 8, '2023-06-10', 'CP-2023-018', 1000.75, 1),
(19, 9, '2023-06-15', 'CP-2023-019', 650.25, 1),
(20, 10, '2023-06-20', 'CP-2023-020', 1750, 1),
(21, 1, '2023-07-01', 'CP-2023-021', 1200.5, 1),
(22, 2, '2023-07-10', 'CP-2023-022', 900, 1),
(23, 3, '2023-07-15', 'CP-2023-023', 500.75, 1),
(24, 4, '2023-07-20', 'CP-2023-024', 1300.25, 1),
(25, 5, '2023-08-01', 'CP-2023-025', 800.5, 1),
(26, 6, '2023-08-10', 'CP-2023-026', 1100, 1),
(27, 7, '2023-08-15', 'CP-2023-027', 950.75, 1),
(28, 8, '2023-08-20', 'CP-2023-028', 1450, 1),
(29, 9, '2023-09-01', 'CP-2023-029', 600.25, 1),
(30, 10, '2023-09-10', 'CP-2023-030', 1850, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_cuenta_bancaria`
--

CREATE TABLE `sigm_cuenta_bancaria` (
  `ID_CUENTA_BANCARIA` int(11) NOT NULL,
  `ID_ENTIDAD_FINANCIERA` int(11) DEFAULT NULL,
  `DSC_BANCO` varchar(255) DEFAULT NULL,
  `NUM_CUENTA_BANCARIA` varchar(255) DEFAULT NULL,
  `TIPO_DIVISA` varchar(10) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_departamento`
--

CREATE TABLE `sigm_departamento` (
  `ID_DEPARTAMENTO` int(11) NOT NULL,
  `DSC_NOMBRE_DEPARTAMENTO` varchar(255) DEFAULT NULL,
  `DSC_DEPARTAMENTO` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_departamento`
--

INSERT INTO `sigm_departamento` (`ID_DEPARTAMENTO`, `DSC_NOMBRE_DEPARTAMENTO`, `DSC_DEPARTAMENTO`, `ESTADO`) VALUES
(1, 'Desarrollo', 'El departamento de desarrollo es el encargado de gestionar todo lo relacionado a la técnología dentro de la organización.', 1),
(2, 'RRHH', 'Departamento de recursos humanos, necesario para la gestión del recurso humano', 1),
(3, 'Limpieza', 'Departamento de limpieza, necesario para la gestión del aseo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_entidad_financiera`
--

CREATE TABLE `sigm_entidad_financiera` (
  `ID_ENTIDAD_FINANCIERA` int(11) NOT NULL,
  `DSC_NOMBRE_ENTIDAD_FINANCIERA` varchar(255) DEFAULT NULL,
  `DSC_TELEFONO_ENTIDAD_FINANCIERA` varchar(50) DEFAULT NULL,
  `DSC_CORREO_ENTIDAD_FINANCIERA` varchar(100) DEFAULT NULL,
  `TIPO_ENTIDAD_FINANCIERA` varchar(25) DEFAULT NULL,
  `FEC_INICIO_FINANCIAMIENTO` date DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_entidad_financiera`
--

INSERT INTO `sigm_entidad_financiera` (`ID_ENTIDAD_FINANCIERA`, `DSC_NOMBRE_ENTIDAD_FINANCIERA`, `DSC_TELEFONO_ENTIDAD_FINANCIERA`, `DSC_CORREO_ENTIDAD_FINANCIERA`, `TIPO_ENTIDAD_FINANCIERA`, `FEC_INICIO_FINANCIAMIENTO`, `ESTADO`) VALUES
(1, 'Banco Nacional', NULL, NULL, 'Banco', NULL, 1),
(2, 'Cooperativa San Miguel', NULL, NULL, 'Cooperativa', NULL, 1),
(3, 'Fintech PayFast', NULL, NULL, 'Fintech', NULL, 1),
(4, 'Banco del Progreso', NULL, NULL, 'Banco', NULL, 0),
(5, 'Caja Popular', NULL, NULL, 'Cooperativa', NULL, 1),
(6, 'Banco Agrícola', NULL, NULL, 'Banco', NULL, 1),
(7, 'Financiera Sol', NULL, NULL, 'Fintech', NULL, 0),
(8, 'Banco Metropolitano', NULL, NULL, 'Banco', NULL, 1),
(9, 'Cooperativa El Ahorro', NULL, NULL, 'Cooperativa', NULL, 1),
(10, 'NeoBank', NULL, NULL, 'Fintech', NULL, 1),
(11, 'Banco Industrial', NULL, NULL, 'Banco', NULL, 1),
(12, 'Cooperativa Unidos', NULL, NULL, 'Cooperativa', NULL, 0),
(13, 'QuickCash', NULL, NULL, 'Fintech', NULL, 1),
(14, 'Banco Comercial', NULL, NULL, 'Banco', NULL, 1),
(15, 'Cooperativa La Esperanza', NULL, NULL, 'Cooperativa', NULL, 1),
(16, 'Banco Central', NULL, NULL, 'Banco', NULL, 1),
(17, 'Fintech MoneyFlow', NULL, NULL, 'Fintech', NULL, 0),
(18, 'Banco Occidental', NULL, NULL, 'Banco', NULL, 1),
(19, 'Cooperativa Progreso', NULL, NULL, 'Cooperativa', NULL, 1),
(20, 'DigitalPay', NULL, NULL, 'Fintech', NULL, 1),
(21, 'Banco del Trabajo', NULL, NULL, 'Banco', NULL, 0),
(22, 'Cooperativa Rural', NULL, NULL, 'Cooperativa', NULL, 1),
(23, 'FastBank', NULL, NULL, 'Fintech', NULL, 1),
(24, 'Banco Internacional', NULL, NULL, 'Banco', NULL, 1),
(25, 'Cooperativa Solidaridad', NULL, NULL, 'Cooperativa', NULL, 1),
(26, 'Banco del Futuro', NULL, NULL, 'Banco', NULL, 1),
(27, 'SmartFinance', NULL, NULL, 'Fintech', NULL, 0),
(28, 'Banco Regional', NULL, NULL, 'Banco', NULL, 1),
(29, 'Cooperativa Horizonte', '84858684', NULL, 'Cooperativa', NULL, 1),
(30, 'PayTech actualizado', '84838684', 'algo@gmail.co', 'Fintech', '2025-04-04', 0),
(31, 'Entidad nueva', NULL, NULL, 'Comercial', NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_factura`
--

CREATE TABLE `sigm_factura` (
  `ID_FACTURA` int(11) NOT NULL,
  `ID_PROVEEDOR` int(11) DEFAULT NULL,
  `ID_COMPROBANTE_PAGO` int(11) DEFAULT NULL,
  `NUM_FACTURA` varchar(255) DEFAULT NULL,
  `FEC_FACTURA` date DEFAULT NULL,
  `DSC_DETALLE_FACTURA` text DEFAULT NULL,
  `MONTO_IMPUESTO` double DEFAULT NULL,
  `MONTO_DESCUENTO` double DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_factura`
--

INSERT INTO `sigm_factura` (`ID_FACTURA`, `ID_PROVEEDOR`, `ID_COMPROBANTE_PAGO`, `NUM_FACTURA`, `FEC_FACTURA`, `DSC_DETALLE_FACTURA`, `MONTO_IMPUESTO`, `MONTO_DESCUENTO`, `ESTADO`) VALUES
(1, 1, 1, 'FAC-2023-001', '2023-01-10', 'Compra de equipos electrónicos y papelería', 150.75, 30, 1),
(2, 2, 2, 'FAC-2023-002', '2023-01-15', 'Adquisición de monitores y accesorios', 90.5, 20, 1),
(3, 3, 3, 'FAC-2023-003', '2023-02-01', 'Suministros de oficina y tecnología', 60.25, 15, 1),
(4, 4, 4, 'FAC-2023-004', '2023-02-10', 'Impresoras, cartuchos y mobiliario', 120, 25, 1),
(5, 5, 5, 'FAC-2023-005', '2023-02-20', 'Material de papelería y equipos', 45, 10, 1),
(6, 6, 6, 'FAC-2023-006', '2023-03-05', 'Mobiliario y dispositivos de red', 180.5, 35, 1),
(7, 7, 7, 'FAC-2023-007', '2023-03-15', 'Routers, teclados y almacenamiento', 75.25, 15, 1),
(8, 8, 8, 'FAC-2023-008', '2023-03-25', 'Discos duros y accesorios de oficina', 100, 20, 1),
(9, 9, 9, 'FAC-2023-009', '2023-04-01', 'Cámaras web, auriculares y papelería', 85.5, 18, 1),
(10, 10, 10, 'FAC-2023-010', '2023-04-10', 'Equipos de proyección y mobiliario', 200.75, 40, 1),
(11, 1, 11, 'FAC-2023-011', '2023-04-15', 'Laptops y suministros de oficina', 110.25, 22, 1),
(12, 2, 12, 'FAC-2023-012', '2023-04-20', 'Monitores y dispositivos USB', 130, 25, 1),
(13, 3, 13, 'FAC-2023-013', '2023-05-01', 'Teclados, ratones y papelería', 55.5, 12, 1),
(14, 4, 14, 'FAC-2023-014', '2023-05-10', 'Impresoras y accesorios tecnológicos', 160.75, 30, 1),
(15, 5, 15, 'FAC-2023-015', '2023-05-15', 'Sillas y material de escritura', 80.25, 15, 1),
(16, 6, 16, 'FAC-2023-016', '2023-05-20', 'Routers y equipos de oficina', 95, 18, 1),
(17, 7, 17, 'FAC-2023-017', '2023-06-01', 'Discos duros y mobiliario', 140.5, 28, 1),
(18, 8, 18, 'FAC-2023-018', '2023-06-10', 'Cámaras y papelería', 105.75, 20, 1),
(19, 9, 19, 'FAC-2023-019', '2023-06-15', 'Auriculares y suministros', 70, 14, 1),
(20, 10, 20, 'FAC-2023-020', '2023-06-20', 'Proyectores y accesorios', 175.25, 35, 1),
(21, 1, 21, 'FAC-2023-021', '2023-07-01', 'Laptops y dispositivos de red', 125.5, 25, 1),
(22, 2, 22, 'FAC-2023-022', '2023-07-10', 'Monitores y papelería', 95, 18, 1),
(23, 3, 23, 'FAC-2023-023', '2023-07-15', 'Teclados y mobiliario', 65.75, 13, 1),
(24, 4, 24, 'FAC-2023-024', '2023-07-20', 'Impresoras y almacenamiento', 135.25, 27, 1),
(25, 5, 25, 'FAC-2023-025', '2023-08-01', 'Sillas y accesorios USB', 85.5, 17, 1),
(26, 6, 26, 'FAC-2023-026', '2023-08-10', 'Routers y papelería', 115, 22, 1),
(27, 7, 27, 'FAC-2023-027', '2023-08-15', 'Discos duros y equipos', 100.25, 20, 1),
(28, 8, 28, 'FAC-2023-028', '2023-08-20', 'Cámaras y mobiliario', 150.75, 30, 1),
(29, 9, 29, 'FAC-2023-029', '2023-09-01', 'Auriculares y suministros', 75, 15, 1),
(30, 10, 30, 'FAC-2023-030', '2023-09-10', 'Proyectores y tecnología', 190.5, 38, 1),
(31, 21, 12, 'FAC-040-2025', '2025-03-23', 'Factura de prueba', 10000, 2000, 1),
(32, 20, 11, 'FAC-041-2025', '2025-03-05', 'Segunda factura de prueba', 1600, 0, 1),
(33, 12, 11, 'FAC-042-2025', '2025-03-14', 'Factura de prueba número 3', 10000, 0, 1),
(35, 21, NULL, '17122', '2025-03-23', '', 0.02, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_producto`
--

CREATE TABLE `sigm_producto` (
  `ID_PRODUCTO` int(11) NOT NULL,
  `ID_CATEGORIA_PRODUCTO` int(11) DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_PRODUCTO` text DEFAULT NULL,
  `NUM_CANTIDAD` double DEFAULT NULL,
  `ID_UNIDAD_MEDICION` int(11) NOT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_producto`
--

INSERT INTO `sigm_producto` (`ID_PRODUCTO`, `ID_CATEGORIA_PRODUCTO`, `DSC_NOMBRE`, `DSC_PRODUCTO`, `NUM_CANTIDAD`, `ID_UNIDAD_MEDICION`, `ESTADO`) VALUES
(1, 9, 'Laptop ASUS VivoBook', 'Laptop ligera, 8GB RAM, SSD 256GB', 12, 1, 51),
(2, 2, 'Monitor Dell 27\"', 'Monitor Dell UltraSharp 27\" 4K UHD', 15, 2, 0),
(3, 3, 'Teclado Logitech', 'Teclado inalámbrico Logitech MX Keys', 51, 3, 1),
(4, 4, 'Mouse Logitech', 'Mouse inalámbrico Logitech MX Master 3', 61, 4, 0),
(5, 5, 'Impresora Epson', 'Impresora multifuncional Epson EcoTank L3150', 10, 5, 1),
(6, 6, 'Cartucho HP 664', 'Cartucho de tinta HP 664 Negro', 200, 6, 1),
(7, 7, 'Router TP-Link', 'Router Wi-Fi TP-Link Archer C6 AC1200', 30, 7, 1),
(8, 8, 'Disco Duro 1TB', 'Disco duro externo Seagate 1TB USB 3.0', 41, 8, 1),
(9, 9, 'Memoria USB 64GB', 'Memoria USB Kingston DataTraveler 64GB', 150, 9, 1),
(10, 10, 'Cámara Web Logitech', 'Cámara web Logitech C920 HD Pro', 21, 1, 1),
(11, 11, 'Auriculares Sony', 'Auriculares Sony WH-1000XM4 con cancelación de ruido', 37, 2, 1),
(12, 12, 'Silla Ergonómica', 'Silla ergonómica de oficina ajustable', 13, 3, 1),
(13, 13, 'Escritorio de Madera', 'Escritorio de madera 120x60 cm', 8, 4, 1),
(14, 14, 'Lámpara LED', 'Lámpara de escritorio LED regulable', 25, 5, 1),
(15, 15, 'Papel A4', 'Resma de papel A4 500 hojas', 107, 6, 1),
(16, 16, 'Bolígrafo Bic', 'Bolígrafo Bic Cristal negro', 500, 7, 1),
(17, 17, 'Cuaderno Espiral', 'Cuaderno espiral 100 hojas cuadriculado', 80, 8, 1),
(18, 18, 'Archivador', 'Archivador de palanca tamaño oficio', 80, 10, 1),
(19, 19, 'Calculadora Casio', 'Calculadora científica Casio FX-991ES', 30, 2, 1),
(20, 20, 'Proyector Epson', 'Proyector Epson EB-X05 3300 lúmenes', 5, 1, 1),
(21, 21, 'Pizarra Blanca', 'Pizarra blanca magnética 90x60 cm', 15, 2, 1),
(22, 22, 'Marcadores', 'Juego de 4 marcadores para pizarra', 60, 3, 1),
(23, 23, 'Cargador USB', 'Cargador USB de pared 20W', 100, 4, 1),
(24, 24, 'Cable HDMI', 'Cable HDMI 2.0 de 3 metros', 75, 5, 1),
(25, 25, 'Batería AA', 'Paquete de 10 baterías AA recargables', 200, 6, 1),
(26, 1, 'Laptop Dell Inspiron', 'Laptop de 15 pulgadas, 16GB RAM, SSD 512GB', 15, 7, 0),
(27, 2, 'Monitor LG 24\"', 'Monitor Full HD de 24 pulgadas', 20, 8, 1),
(28, 3, 'Teclado Mecánico RGB', 'Teclado con retroiluminación RGB', 30, 9, 1),
(29, 4, 'Mouse Inalámbrico', 'Mouse ergonómico con batería recargable', 50, 10, 1),
(30, 5, 'Impresora Brother', 'Impresora láser monocromática', 10, 1, 1),
(31, 6, 'Cartucho Brother TN-450', 'Cartucho de tóner negro', 100, 2, 1),
(32, 7, 'Router WiFi 6', 'Router de alta velocidad con soporte WiFi 6', 25, 3, 1),
(33, 8, 'SSD 500GB', 'Disco sólido de 500GB, alta velocidad', 40, 4, 1),
(34, 9, 'Pendrive 128GB', 'Memoria USB de 128GB, USB 3.0', 80, 5, 1),
(35, 10, 'Cámara Web 4K', 'Cámara web con resolución 4K', 15, 6, 1),
(36, 11, 'Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 25, 7, 1),
(37, 12, 'Silla de Oficina', 'Silla ergonómica ajustable', 10, 8, 1),
(38, 13, 'Mesa Plegable', 'Mesa de madera plegable para oficina', 5, 9, 1),
(39, 14, 'Lámpara de Escritorio', 'Lámpara LED regulable', 30, 10, 1),
(40, 15, 'Papel Carta', 'Paquete de 500 hojas de papel blanco', 100, 1, 1),
(41, 16, 'Bolígrafo Pilot', 'Bolígrafo de tinta gel negro', 300, 2, 1),
(42, 17, 'Cuaderno Rayado', 'Cuaderno de 100 hojas rayadas', 50, 3, 1),
(43, 18, 'Carpeta Archivadora', 'Carpeta de 3 anillos para archivar', 40, 4, 1),
(44, 19, 'Calculadora Científica', 'Calculadora con funciones científicas', 20, 5, 1),
(45, 20, 'Proyector LED', 'Proyector portátil con resolución HD', 5, 6, 1),
(46, 21, 'Pizarra Magnética', 'Pizarra de 90x60 cm con superficie magnética', 10, 7, 1),
(47, 22, 'Marcador Borrable', 'Marcador para pizarra, color negro', 60, 8, 1),
(48, 23, 'Cargador USB-C', 'Cargador rápido USB-C de 20W', 70, 9, 1),
(49, 24, 'Cable USB 2m', 'Cable USB de 2 metros para datos y carga', 50, 10, 1),
(50, 25, 'Batería AAA', 'Paquete de 4 baterías AAA recargables', 200, 1, 1),
(51, 1, 'Laptop ASUS VivoBook', 'Laptop ligera, 8GB RAM, SSD 256GB', 9, 2, 1),
(52, 2, 'Monitor AOC 22\"', 'Monitor LED de 22 pulgadas', 18, 3, 1),
(53, 3, 'Teclado Silencioso', 'Teclado de membrana silencioso', 35, 4, 1),
(54, 4, 'Mouse Óptico USB', 'Mouse con cable, 1200 DPI', 60, 5, 1),
(55, 5, 'Impresora Canon', 'Impresora multifunción a color', 8, 6, 1),
(56, 6, 'Cartucho Canon PG-50', 'Cartucho de tinta negra', 90, 7, 1),
(57, 7, 'Extensor WiFi', 'Extensor de señal WiFi de doble banda', 20, 8, 1),
(58, 8, 'HDD 2TB', 'Disco duro externo de 2TB', 15, 9, 1),
(59, 9, 'Pendrive 32GB', 'Memoria USB de 32GB, USB 2.0', 100, 10, 1),
(60, 10, 'Cámara Web HD', 'Cámara web con micrófono integrado', 25, 1, 1),
(61, 17, 'pp', 'N/A', 0, 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_proveedor`
--

CREATE TABLE `sigm_proveedor` (
  `ID_PROVEEDOR` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_PROVINCIA` varchar(255) DEFAULT NULL,
  `DSC_CANTON` varchar(255) DEFAULT NULL,
  `DSC_DISTRITO` varchar(255) DEFAULT NULL,
  `DSC_DIRECCION` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_proveedor`
--

INSERT INTO `sigm_proveedor` (`ID_PROVEEDOR`, `DSC_NOMBRE`, `DSC_PROVINCIA`, `DSC_CANTON`, `DSC_DISTRITO`, `DSC_DIRECCION`, `ESTADO`) VALUES
(1, 'Mega Super', 'Heredia', 'Sarapiquí', 'Puerto Viejo', 'Al frente del chino el dragon.', 1),
(2, 'Proveedor Uno', 'San José', 'San José', 'Carmen', 'Avenida 1, Calle 2', 1),
(3, 'Proveedor Dos', 'Alajuela', 'Alajuela', 'Central', 'Avenida 2, Calle 3', 1),
(4, 'Proveedor Tres', 'Cartago', 'Cartago', 'Oriental', 'Calle 3, Avenida 4', 1),
(5, 'Proveedor Cuatro', 'Heredia', 'Heredia', 'Ulloa', 'Calle 4, Avenida 5', 1),
(6, 'Proveedor Cinco', 'Guanacaste', 'Liberia', 'Central', 'Calle 5, Avenida 6', 1),
(7, 'Proveedor Seis', 'Puntarenas', 'Puntarenas', 'Central', 'Calle 6, Avenida 7', 1),
(8, 'Proveedor Siete', 'Limón', 'Limón', 'Central', 'Calle 7, Avenida 8', 1),
(9, 'Proveedor Ocho', 'San José', 'Escazú', 'San Rafael', 'Calle 8, Avenida 9', 1),
(10, 'Proveedor Nueve', 'Alajuela', 'Atenas', 'Central', 'Calle 9, Avenida 10', 1),
(11, 'Proveedor Diez', 'Cartago', 'Turrialba', 'La Suiza', 'Calle 10, Avenida 11', 1),
(12, 'Proveedor Once', 'Heredia', 'San Isidro', 'Central', 'Calle 11, Avenida 12', 1),
(13, 'Proveedor Doce', 'Guanacaste', 'Nicoya', 'Central', 'Calle 12, Avenida 13', 1),
(14, 'Proveedor Trece', 'Puntarenas', 'Quepos', 'Central', 'Calle 13, Avenida 14', 1),
(15, 'Proveedor Catorce', 'Limón', 'Puerto Viejo', 'Central', 'Calle 14, Avenida 15', 1),
(16, 'Proveedor Quince', 'San José', 'Moravia', 'La Trinidad', 'Calle 15, Avenida 16', 0),
(17, 'Proveedor Dieciséis', 'Alajuela', 'San Ramón', 'Central', 'Calle 16, Avenida 17', 1),
(18, 'Proveedor Diecisiete', 'Cartago', 'Oreamuno', 'Central', 'Calle 17, Avenida 18', 1),
(19, 'Proveedor Dieciocho', 'Heredia', 'San Pablo', 'Central', 'Calle 18, Avenida 19', 1),
(20, 'Proveedor Diecinueve', 'Guanacaste', 'Cañas', 'Central', 'Calle 19, Avenida 20', 1),
(21, 'Coocique', 'Heredia', 'Sarapiqui', 'Horquetas', 'Puerto, detrás de no se´donde', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_puesto_trabajo`
--

CREATE TABLE `sigm_puesto_trabajo` (
  `ID_PUESTO_TRABAJO` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_PUESTO_TRABAJO` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_puesto_trabajo`
--

INSERT INTO `sigm_puesto_trabajo` (`ID_PUESTO_TRABAJO`, `DSC_NOMBRE`, `DSC_PUESTO_TRABAJO`, `ESTADO`) VALUES
(1, 'Gerente', 'Encargado del departamento de desarrollo, es quien vela por que el funcionamiento de dicho departamento sea el adecuado.', 1),
(2, 'Miselaneo/a', 'Persona encargada de la limpuieza.', 1),
(3, 'Administrador', 'Persona encargada de administrar', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_rol`
--

CREATE TABLE `sigm_rol` (
  `ID_ROL` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(50) NOT NULL,
  `DSC_ROL` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_rol`
--

INSERT INTO `sigm_rol` (`ID_ROL`, `DSC_NOMBRE`, `DSC_ROL`) VALUES
(1, 'Administrador', 'Usuario con acceso total al sistema, es capaz de administrar todo lo que hay en el.'),
(2, 'Asistente', 'Tiene acceso solo a las funcionalidades administrativas que respectan a la gestión del inventario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_unidad_medicion`
--

CREATE TABLE `sigm_unidad_medicion` (
  `ID_UNIDAD_MEDICION` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(50) NOT NULL,
  `ESTADO` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sigm_unidad_medicion`
--

INSERT INTO `sigm_unidad_medicion` (`ID_UNIDAD_MEDICION`, `DSC_NOMBRE`, `ESTADO`) VALUES
(1, 'Kilogramo', 1),
(2, 'Litro', 1),
(3, 'Metro', 1),
(4, 'Unidad', 1),
(5, 'Gramo', 1),
(6, 'Mililitro', 1),
(7, 'Centímetro', 1),
(8, 'Metro cuadrado', 1),
(9, 'Metro cúbico', 1),
(10, 'Pieza', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_usuario`
--

CREATE TABLE `sigm_usuario` (
  `ID_USUARIO` int(11) NOT NULL,
  `ID_COLABORADOR` int(11) DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `ID_ROL` int(11) DEFAULT NULL,
  `DSC_PASSWORD` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_usuario`
--

INSERT INTO `sigm_usuario` (`ID_USUARIO`, `ID_COLABORADOR`, `DSC_NOMBRE`, `ID_ROL`, `DSC_PASSWORD`, `ESTADO`) VALUES
(1, 1, 'AdamAG124', 1, '$2b$10$RwK/N7hKAkrRLnuPvg9Yje60fZeAcbz9Ba5UyniqdQ/U0cQAn/kwy', 1),
(2, 2, 'KaroVG1622', 2, '$2b$10$wwGRKKQ4hqFqbFiytxhUgOuGV0UQJE6EagcKkEYCTctl27IwZgsLS', 1),
(3, 3, 'LuciaP3', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 0),
(4, 4, 'JuanG4', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(5, 5, 'MariaL5', 1, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 0),
(6, 6, 'DiegoH6', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 0),
(7, 7, 'AndreaM7', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(8, 8, 'CarlosJ8', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 0),
(9, 9, 'DianaG9', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(10, 10, 'FernandoC10', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 0),
(11, 11, 'AnaV11', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(12, 12, 'RobertoC12', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(13, 13, 'SofiaO13', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 0),
(14, 14, 'GabrielM14', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(15, 15, 'RaquelA15', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(16, 16, 'EstebanV16', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(17, 17, 'KarlaR17', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(18, 18, 'DanielN18', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(19, 19, 'AliciaT19', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(22, 21, 'MonicaME258', 1, '$2b$10$yf1oJiM21z0gt1xRUh8jTelSPATsjR6Nr4e97mqgX/PTj8b4rVPfC', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigt_factura_producto`
--

CREATE TABLE `sigt_factura_producto` (
  `ID_FACTURA_PRODUCTO` int(11) NOT NULL,
  `ID_FACTURA` int(11) DEFAULT NULL,
  `ID_PRODUCTO` int(11) DEFAULT NULL,
  `NUM_CANTIDAD_ANTERIOR` double DEFAULT NULL,
  `NUM_CANTIDAD_ENTRANDO` double DEFAULT NULL,
  `MONTO_PRECIO_NUEVA` double DEFAULT NULL,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigt_factura_producto`
--

INSERT INTO `sigt_factura_producto` (`ID_FACTURA_PRODUCTO`, `ID_FACTURA`, `ID_PRODUCTO`, `NUM_CANTIDAD_ANTERIOR`, `NUM_CANTIDAD_ENTRANDO`, `MONTO_PRECIO_NUEVA`, `ID_USUARIO`, `ESTADO`) VALUES
(1, 1, 1, 20, 5, 850, 1, 1),
(2, 1, 6, 150, 50, 15, 1, 1),
(3, 1, 11, 30, 5, 200, 1, 1),
(4, 1, 26, 15, 5, 900, 1, 1),
(5, 2, 2, 10, 5, 300, 2, 1),
(6, 2, 7, 25, 5, 80, 2, 1),
(7, 2, 12, 10, 2, 150, 2, 1),
(8, 2, 27, 20, 5, 250, 2, 1),
(9, 3, 3, 40, 10, 60, 3, 1),
(10, 3, 8, 30, 10, 120, 3, 1),
(11, 3, 13, 5, 3, 80, 3, 1),
(12, 3, 28, 30, 10, 75, 3, 1),
(13, 4, 4, 50, 10, 45, 4, 1),
(14, 4, 9, 100, 50, 10, 4, 1),
(15, 4, 14, 20, 5, 25, 4, 1),
(16, 4, 29, 50, 10, 30, 4, 1),
(17, 5, 5, 5, 5, 250, 5, 1),
(18, 5, 10, 15, 5, 90, 5, 1),
(19, 5, 15, 80, 20, 5, 5, 1),
(20, 5, 30, 10, 5, 300, 5, 1),
(21, 6, 16, 400, 100, 0.5, 1, 1),
(22, 6, 17, 60, 20, 3, 1, 1),
(23, 6, 18, 40, 10, 8, 1, 1),
(24, 6, 31, 100, 20, 40, 1, 1),
(25, 7, 19, 25, 5, 15, 2, 1),
(26, 7, 20, 3, 2, 500, 2, 1),
(27, 7, 21, 10, 5, 50, 2, 1),
(28, 7, 32, 25, 5, 120, 2, 1),
(29, 8, 22, 50, 10, 6, 3, 1),
(30, 8, 23, 80, 20, 12, 3, 1),
(31, 8, 24, 60, 15, 8, 3, 1),
(32, 8, 33, 40, 10, 150, 3, 1),
(33, 31, 11, 35, 1, 5000, 1, 1),
(34, 31, 10, 20, 1, 50000, 1, 1),
(35, 31, 15, 100, 5, 3000, 1, 1),
(36, 32, 8, 40, 1, 35000, 1, 1),
(37, 32, 15, 105, 2, 3500, 1, 1),
(38, 32, 18, 50, 30, 200, 1, 1),
(39, 33, 3, 50, 1, 20000, 1, 1),
(40, 33, 4, 60, 1, 15000, 1, 1),
(41, 33, 11, 36, 1, 50000, 1, 1),
(42, 33, 12, 12, 1, 12000, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigt_salida`
--

CREATE TABLE `sigt_salida` (
  `ID_SALIDA` int(11) NOT NULL,
  `ID_COLABORADOR_SACANDO` int(11) DEFAULT NULL,
  `ID_COLABORADOR_RECIBIENDO` int(11) DEFAULT NULL,
  `FEC_SALIDA` datetime DEFAULT NULL,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `DSC_DETALLE_SALIDA` text DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigt_salida`
--

INSERT INTO `sigt_salida` (`ID_SALIDA`, `ID_COLABORADOR_SACANDO`, `ID_COLABORADOR_RECIBIENDO`, `FEC_SALIDA`, `ID_USUARIO`, `DSC_DETALLE_SALIDA`, `ESTADO`) VALUES
(1, 1, 2, '2025-03-01 00:00:00', 1, NULL, 1),
(2, 2, 3, '2025-03-02 00:00:00', 2, NULL, 1),
(3, 3, 4, '2025-03-03 00:00:00', 3, NULL, 1),
(4, 4, 5, '2025-03-04 00:00:00', 4, NULL, 1),
(5, 5, 6, '2025-03-05 00:00:00', 5, NULL, 1),
(6, 6, 7, '2025-03-06 00:00:00', 6, NULL, 1),
(7, 7, 8, '2025-03-07 00:00:00', 7, NULL, 1),
(8, 8, 9, '2025-03-08 00:00:00', 8, NULL, 1),
(9, 9, 10, '2025-03-09 00:00:00', 9, NULL, 1),
(10, 10, 11, '2025-03-13 17:00:00', 10, 'Probando la edición de una salida de producto.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigt_salida_producto`
--

CREATE TABLE `sigt_salida_producto` (
  `ID_SALIDA_PRODUCTO` int(11) NOT NULL,
  `ID_PRODUCTO` int(11) DEFAULT NULL,
  `ID_SALIDA` int(11) DEFAULT NULL,
  `NUM_CANTIDAD_ANTERIOR` double DEFAULT NULL,
  `NUM_CANTIDAD_SALIENDO` double DEFAULT NULL,
  `NUM_CANTIDAD_NUEVA` double DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigt_salida_producto`
--

INSERT INTO `sigt_salida_producto` (`ID_SALIDA_PRODUCTO`, `ID_PRODUCTO`, `ID_SALIDA`, `NUM_CANTIDAD_ANTERIOR`, `NUM_CANTIDAD_SALIENDO`, `NUM_CANTIDAD_NUEVA`, `ESTADO`) VALUES
(1, 1, 1, 1, 10, 40, 1),
(2, 2, 2, 2, 5, 25, 1),
(3, 3, 3, 3, 20, 55, 1),
(4, 4, 4, 4, 15, 45, 1),
(5, 5, 5, 5, 10, 90, 1),
(6, 6, 6, 200, 50, 150, 1),
(7, 7, 7, 150, 40, 110, 1),
(8, 8, 8, 80, 10, 70, 1),
(9, 9, 9, 95, 25, 70, 0),
(10, 10, 10, 130, 40, 90, 0),
(11, 51, 10, 12, 3, 9, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `sigm_categoria_producto`
--
ALTER TABLE `sigm_categoria_producto`
  ADD PRIMARY KEY (`ID_CATEGORIA_PRODUCTO`);

--
-- Indices de la tabla `sigm_colaborador`
--
ALTER TABLE `sigm_colaborador`
  ADD PRIMARY KEY (`ID_COLABORADOR`),
  ADD KEY `ID_DEPARTAMENTO` (`ID_DEPARTAMENTO`),
  ADD KEY `ID_PUESTO` (`ID_PUESTO`);

--
-- Indices de la tabla `sigm_comprobante_pago`
--
ALTER TABLE `sigm_comprobante_pago`
  ADD PRIMARY KEY (`ID_COMPROBANTE_PAGO`),
  ADD KEY `ID_ENTIDAD_FINANCIERA` (`ID_ENTIDAD_FINANCIERA`);

--
-- Indices de la tabla `sigm_cuenta_bancaria`
--
ALTER TABLE `sigm_cuenta_bancaria`
  ADD PRIMARY KEY (`ID_CUENTA_BANCARIA`),
  ADD KEY `ID_ENTIDAD_FINANCIERA` (`ID_ENTIDAD_FINANCIERA`);

--
-- Indices de la tabla `sigm_departamento`
--
ALTER TABLE `sigm_departamento`
  ADD PRIMARY KEY (`ID_DEPARTAMENTO`);

--
-- Indices de la tabla `sigm_entidad_financiera`
--
ALTER TABLE `sigm_entidad_financiera`
  ADD PRIMARY KEY (`ID_ENTIDAD_FINANCIERA`);

--
-- Indices de la tabla `sigm_factura`
--
ALTER TABLE `sigm_factura`
  ADD PRIMARY KEY (`ID_FACTURA`),
  ADD KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  ADD KEY `ID_COMPROBANTE_PAGO` (`ID_COMPROBANTE_PAGO`);

--
-- Indices de la tabla `sigm_producto`
--
ALTER TABLE `sigm_producto`
  ADD PRIMARY KEY (`ID_PRODUCTO`),
  ADD KEY `ID_CATEGORIA_PRODUCTO` (`ID_CATEGORIA_PRODUCTO`),
  ADD KEY `ID_UNIDAD_MEDICION` (`ID_UNIDAD_MEDICION`) USING BTREE;

--
-- Indices de la tabla `sigm_proveedor`
--
ALTER TABLE `sigm_proveedor`
  ADD PRIMARY KEY (`ID_PROVEEDOR`);

--
-- Indices de la tabla `sigm_puesto_trabajo`
--
ALTER TABLE `sigm_puesto_trabajo`
  ADD PRIMARY KEY (`ID_PUESTO_TRABAJO`);

--
-- Indices de la tabla `sigm_rol`
--
ALTER TABLE `sigm_rol`
  ADD PRIMARY KEY (`ID_ROL`);

--
-- Indices de la tabla `sigm_unidad_medicion`
--
ALTER TABLE `sigm_unidad_medicion`
  ADD PRIMARY KEY (`ID_UNIDAD_MEDICION`);

--
-- Indices de la tabla `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  ADD PRIMARY KEY (`ID_USUARIO`),
  ADD UNIQUE KEY `ID_COLABORADOR` (`ID_COLABORADOR`),
  ADD UNIQUE KEY `DSC_NOMBRE` (`DSC_NOMBRE`),
  ADD KEY `ID_ROL` (`ID_ROL`);

--
-- Indices de la tabla `sigt_factura_producto`
--
ALTER TABLE `sigt_factura_producto`
  ADD PRIMARY KEY (`ID_FACTURA_PRODUCTO`),
  ADD KEY `ID_FACTURA` (`ID_FACTURA`),
  ADD KEY `ID_PRODUCTO` (`ID_PRODUCTO`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`);

--
-- Indices de la tabla `sigt_salida`
--
ALTER TABLE `sigt_salida`
  ADD PRIMARY KEY (`ID_SALIDA`),
  ADD KEY `ID_COLABORADOR_SACANDO` (`ID_COLABORADOR_SACANDO`),
  ADD KEY `ID_COLABORADOR_RECIBIENDO` (`ID_COLABORADOR_RECIBIENDO`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`);

--
-- Indices de la tabla `sigt_salida_producto`
--
ALTER TABLE `sigt_salida_producto`
  ADD PRIMARY KEY (`ID_SALIDA_PRODUCTO`),
  ADD KEY `ID_PRODUCTO` (`ID_PRODUCTO`),
  ADD KEY `ID_SALIDA` (`ID_SALIDA`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `sigm_categoria_producto`
--
ALTER TABLE `sigm_categoria_producto`
  MODIFY `ID_CATEGORIA_PRODUCTO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `sigm_colaborador`
--
ALTER TABLE `sigm_colaborador`
  MODIFY `ID_COLABORADOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `sigm_comprobante_pago`
--
ALTER TABLE `sigm_comprobante_pago`
  MODIFY `ID_COMPROBANTE_PAGO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `sigm_cuenta_bancaria`
--
ALTER TABLE `sigm_cuenta_bancaria`
  MODIFY `ID_CUENTA_BANCARIA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigm_departamento`
--
ALTER TABLE `sigm_departamento`
  MODIFY `ID_DEPARTAMENTO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sigm_entidad_financiera`
--
ALTER TABLE `sigm_entidad_financiera`
  MODIFY `ID_ENTIDAD_FINANCIERA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `sigm_factura`
--
ALTER TABLE `sigm_factura`
  MODIFY `ID_FACTURA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `sigm_producto`
--
ALTER TABLE `sigm_producto`
  MODIFY `ID_PRODUCTO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `sigm_proveedor`
--
ALTER TABLE `sigm_proveedor`
  MODIFY `ID_PROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `sigm_puesto_trabajo`
--
ALTER TABLE `sigm_puesto_trabajo`
  MODIFY `ID_PUESTO_TRABAJO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sigm_rol`
--
ALTER TABLE `sigm_rol`
  MODIFY `ID_ROL` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sigm_unidad_medicion`
--
ALTER TABLE `sigm_unidad_medicion`
  MODIFY `ID_UNIDAD_MEDICION` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  MODIFY `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `sigt_factura_producto`
--
ALTER TABLE `sigt_factura_producto`
  MODIFY `ID_FACTURA_PRODUCTO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `sigt_salida`
--
ALTER TABLE `sigt_salida`
  MODIFY `ID_SALIDA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `sigt_salida_producto`
--
ALTER TABLE `sigt_salida_producto`
  MODIFY `ID_SALIDA_PRODUCTO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `sigm_colaborador`
--
ALTER TABLE `sigm_colaborador`
  ADD CONSTRAINT `SIGM_COLABORADOR_ibfk_1` FOREIGN KEY (`ID_DEPARTAMENTO`) REFERENCES `sigm_departamento` (`ID_DEPARTAMENTO`),
  ADD CONSTRAINT `SIGM_COLABORADOR_ibfk_2` FOREIGN KEY (`ID_PUESTO`) REFERENCES `sigm_puesto_trabajo` (`ID_PUESTO_TRABAJO`);

--
-- Filtros para la tabla `sigm_comprobante_pago`
--
ALTER TABLE `sigm_comprobante_pago`
  ADD CONSTRAINT `SIGM_COMPROBANTE_PAGO_ibfk_1` FOREIGN KEY (`ID_ENTIDAD_FINANCIERA`) REFERENCES `sigm_entidad_financiera` (`ID_ENTIDAD_FINANCIERA`);

--
-- Filtros para la tabla `sigm_cuenta_bancaria`
--
ALTER TABLE `sigm_cuenta_bancaria`
  ADD CONSTRAINT `SIGM_CUENTA_BANCARIA_ibfk_1` FOREIGN KEY (`ID_ENTIDAD_FINANCIERA`) REFERENCES `sigm_entidad_financiera` (`ID_ENTIDAD_FINANCIERA`);

--
-- Filtros para la tabla `sigm_factura`
--
ALTER TABLE `sigm_factura`
  ADD CONSTRAINT `SIGM_FACTURA_ibfk_1` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `sigm_proveedor` (`ID_PROVEEDOR`),
  ADD CONSTRAINT `SIGM_FACTURA_ibfk_2` FOREIGN KEY (`ID_COMPROBANTE_PAGO`) REFERENCES `sigm_comprobante_pago` (`ID_COMPROBANTE_PAGO`);

--
-- Filtros para la tabla `sigm_producto`
--
ALTER TABLE `sigm_producto`
  ADD CONSTRAINT `SIGM_PRODUCTO_ibfk_1` FOREIGN KEY (`ID_CATEGORIA_PRODUCTO`) REFERENCES `sigm_categoria_producto` (`ID_CATEGORIA_PRODUCTO`),
  ADD CONSTRAINT `SIGM_PRODUCTO_ibfk_2` FOREIGN KEY (`ID_UNIDAD_MEDICION`) REFERENCES `sigm_unidad_medicion` (`ID_UNIDAD_MEDICION`);

--
-- Filtros para la tabla `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  ADD CONSTRAINT `SIGM_USUARIO_ibfk_1` FOREIGN KEY (`ID_COLABORADOR`) REFERENCES `sigm_colaborador` (`ID_COLABORADOR`),
  ADD CONSTRAINT `SIGM_USUARIO_ibfk_2` FOREIGN KEY (`ID_ROL`) REFERENCES `sigm_rol` (`ID_ROL`);

--
-- Filtros para la tabla `sigt_factura_producto`
--
ALTER TABLE `sigt_factura_producto`
  ADD CONSTRAINT `SIGT_FACTURA_PRODUCTO_ibfk_1` FOREIGN KEY (`ID_FACTURA`) REFERENCES `sigm_factura` (`ID_FACTURA`),
  ADD CONSTRAINT `SIGT_FACTURA_PRODUCTO_ibfk_2` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `sigm_producto` (`ID_PRODUCTO`),
  ADD CONSTRAINT `SIGT_FACTURA_PRODUCTO_ibfk_3` FOREIGN KEY (`ID_USUARIO`) REFERENCES `sigm_usuario` (`ID_USUARIO`);

--
-- Filtros para la tabla `sigt_salida`
--
ALTER TABLE `sigt_salida`
  ADD CONSTRAINT `SIGT_SALIDA_ibfk_1` FOREIGN KEY (`ID_COLABORADOR_SACANDO`) REFERENCES `sigm_colaborador` (`ID_COLABORADOR`),
  ADD CONSTRAINT `SIGT_SALIDA_ibfk_2` FOREIGN KEY (`ID_COLABORADOR_RECIBIENDO`) REFERENCES `sigm_colaborador` (`ID_COLABORADOR`),
  ADD CONSTRAINT `SIGT_SALIDA_ibfk_3` FOREIGN KEY (`ID_USUARIO`) REFERENCES `sigm_usuario` (`ID_USUARIO`);

--
-- Filtros para la tabla `sigt_salida_producto`
--
ALTER TABLE `sigt_salida_producto`
  ADD CONSTRAINT `SIGT_SALIDA_PRODUCTO_ibfk_1` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `sigm_producto` (`ID_PRODUCTO`),
  ADD CONSTRAINT `SIGT_SALIDA_PRODUCTO_ibfk_2` FOREIGN KEY (`ID_SALIDA`) REFERENCES `sigt_salida` (`ID_SALIDA`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
