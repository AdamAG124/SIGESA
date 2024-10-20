-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-10-2024 a las 06:35:32
-- Versión del servidor: 9.0.1
-- Versión de PHP: 8.0.30

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
  `ID_CATEGORIA_PRODUCTO` int NOT NULL,
  `DSC_NOMBRE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_DESCRIPCION` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_colaborador`
--

CREATE TABLE `sigm_colaborador` (
  `ID_COLABORADOR` int NOT NULL,
  `ID_DEPARTAMENTO` int DEFAULT NULL,
  `ID_PUESTO` int DEFAULT NULL,
  `DSC_SEGUNDO_APELLIDO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_NACIMIENTO` date DEFAULT NULL,
  `NUM_TELEFONO` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_INGRESO` date DEFAULT NULL,
  `FEC_SALIDA` date DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL,
  `DSC_CORREO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_CEDULA` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_PRIMER_APELLIDO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_colaborador`
--

INSERT INTO `sigm_colaborador` (`ID_COLABORADOR`, `ID_DEPARTAMENTO`, `ID_PUESTO`, `DSC_SEGUNDO_APELLIDO`, `FEC_NACIMIENTO`, `NUM_TELEFONO`, `FEC_INGRESO`, `FEC_SALIDA`, `ESTADO`, `DSC_CORREO`, `DSC_CEDULA`, `DSC_NOMBRE`, `DSC_PRIMER_APELLIDO`) VALUES
(1, 1, 1, 'González', '2001-08-25', '63133860', '2022-09-01', NULL, 1, 'adam.acuna.gonzalez@est.una.ac.cr', '118200907A', 'Adam', 'Acuña'),
(2, 1, 1, 'Gómez', '2001-10-16', '85218760', '2022-09-01', NULL, 1, 'karolayvargasg@gmail.com', '5461623101989', 'Karolay', 'Vargas'),
(3, 1, 1, 'Ramírez', '1990-07-15', '62452341', '2021-06-12', NULL, 1, 'lucia.ramirez@empresa.com', '109876543', 'Lucía', 'Pérez'),
(4, 1, 1, 'Vargas', '1985-09-30', '63214578', '2020-05-01', NULL, 1, 'juan.vargas@empresa.com', '234567890', 'Juan', 'Gómez'),
(5, 1, 1, 'Rodríguez', '1993-01-10', '61543298', '2022-07-20', NULL, 1, 'maria.rodriguez@empresa.com', '345678901', 'María', 'Lopez'),
(6, 1, 1, 'Sánchez', '1992-12-15', '62341257', '2023-01-15', NULL, 1, 'diego.sanchez@empresa.com', '456789012', 'Diego', 'Hernández'),
(7, 1, 1, 'Guzmán', '1988-04-22', '62134679', '2021-09-10', NULL, 1, 'andrea.guzman@empresa.com', '567890123', 'Andrea', 'Martínez'),
(8, 1, 1, 'Mejía', '1989-11-03', '62547812', '2020-12-05', NULL, 1, 'carlos.mejia@empresa.com', '678901234', 'Carlos', 'Jiménez'),
(9, 1, 1, 'Solís', '1991-02-14', '62014567', '2021-03-17', NULL, 1, 'diana.solis@empresa.com', '789012345', 'Diana', 'García'),
(10, 1, 1, 'Rojas', '1995-06-29', '62894312', '2022-04-09', NULL, 1, 'fernando.rojas@empresa.com', '890123456', 'Fernando', 'Castro'),
(11, 1, 1, 'Pacheco', '1994-10-18', '62983451', '2023-02-11', NULL, 1, 'ana.pacheco@empresa.com', '901234567', 'Ana', 'Vega'),
(12, 1, 1, 'Valverde', '1987-08-24', '61983745', '2019-11-22', NULL, 1, 'roberto.valverde@empresa.com', '912345678', 'Roberto', 'Chacón'),
(13, 1, 1, 'Mora', '1996-03-27', '62674930', '2022-06-14', NULL, 1, 'sofia.mora@empresa.com', '923456789', 'Sofía', 'Ortega'),
(14, 1, 1, 'Arias', '1992-05-12', '61734982', '2023-05-21', NULL, 1, 'gabriel.arias@empresa.com', '934567890', 'Gabriel', 'Monge'),
(15, 1, 1, 'García', '1993-07-08', '62245839', '2021-08-02', NULL, 1, 'raquel.garcia@empresa.com', '945678901', 'Raquel', 'Alvarado'),
(16, 1, 1, 'Zamora', '1986-09-19', '62493817', '2020-09-23', NULL, 1, 'esteban.zamora@empresa.com', '956789012', 'Esteban', 'Vargas'),
(17, 1, 1, 'Murillo', '1989-10-11', '62983721', '2021-10-13', NULL, 1, 'karla.murillo@empresa.com', '967890123', 'Karla', 'Rodríguez'),
(18, 1, 1, 'Castillo', '1990-11-25', '61834972', '2022-11-01', NULL, 1, 'daniel.castillo@empresa.com', '978901234', 'Daniel', 'Navarro'),
(19, 1, 1, 'Cordero', '1984-04-15', '61634892', '2019-01-29', NULL, 1, 'alicia.cordero@empresa.com', '989012345', 'Alicia', 'Torres'),
(20, 1, 1, 'Fernández', '1991-05-05', '61435982', '2020-03-14', NULL, 1, 'pablo.fernandez@empresa.com', '990123456', 'Pablo', 'Cruz'),
(21, 1, 1, 'Esquivel', '1993-12-23', '62038495', '2021-12-07', NULL, 1, 'monica.esquivel@empresa.com', '991234567', 'Mónica', 'Méndez');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_comprobante_pago`
--

CREATE TABLE `sigm_comprobante_pago` (
  `ID_COMPROBANTE_PAGO` int NOT NULL,
  `ID_ENTIDAD_FINANCIERA` int DEFAULT NULL,
  `FEC_PAGO` date DEFAULT NULL,
  `NUM_COMPROBANTE_PAGO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MONTO_COMPROBANTE_PAGO` double DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_cuenta_bancaria`
--

CREATE TABLE `sigm_cuenta_bancaria` (
  `ID_CUENTA_BANCARIA` int NOT NULL,
  `ID_ENTIDAD_FINANCIERA` int DEFAULT NULL,
  `DSC_BANCO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NUM_CUENTA_BANCARIA` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TIPO_DIVISA` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_departamento`
--

CREATE TABLE `sigm_departamento` (
  `ID_DEPARTAMENTO` int NOT NULL,
  `DSC_NOMBRE_DEPARTAMENTO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_DEPARTAMENTO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_departamento`
--

INSERT INTO `sigm_departamento` (`ID_DEPARTAMENTO`, `DSC_NOMBRE_DEPARTAMENTO`, `DSC_DEPARTAMENTO`, `ESTADO`) VALUES
(1, 'Desarrollo', 'El departamento de desarrollo es el encargado de gestionar todo lo relacionado a la técnología dentro de la organización.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_entidad_financiera`
--

CREATE TABLE `sigm_entidad_financiera` (
  `ID_ENTIDAD_FINANCIERA` int NOT NULL,
  `DSC_NOMBRE_ENTIDAD_FINANCIERA` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TIPO_ENTIDAD_FINANCIERA` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_factura`
--

CREATE TABLE `sigm_factura` (
  `ID_FACTURA` int NOT NULL,
  `ID_PROVEEDOR` int DEFAULT NULL,
  `ID_COMPROBANTE_PAGO` int DEFAULT NULL,
  `NUM_FACTURA` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FEC_FACTURA` date DEFAULT NULL,
  `DSC_DETALLE_FACTURA` text COLLATE utf8mb4_unicode_ci,
  `MONTO_IMPUESTO` double DEFAULT NULL,
  `MONTO_DESCUENTO` double DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_producto`
--

CREATE TABLE `sigm_producto` (
  `ID_PRODUCTO` int NOT NULL,
  `ID_CATEGORIA_PRODUCTO` int DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_PRODUCTO` text COLLATE utf8mb4_unicode_ci,
  `NUM_CANTIDAD` double DEFAULT NULL,
  `DSC_UNIDAD_MEDICION` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_proveedor`
--

CREATE TABLE `sigm_proveedor` (
  `ID_PROVEEDOR` int NOT NULL,
  `DSC_NOMBRE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_PROVINCIA` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_CANTON` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_DISTRITO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_DIRECCION` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_puesto_trabajo`
--

CREATE TABLE `sigm_puesto_trabajo` (
  `ID_PUESTO_TRABAJO` int NOT NULL,
  `DSC_NOMBRE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DSC_PUESTO_TRABAJO` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_puesto_trabajo`
--

INSERT INTO `sigm_puesto_trabajo` (`ID_PUESTO_TRABAJO`, `DSC_NOMBRE`, `DSC_PUESTO_TRABAJO`, `ESTADO`) VALUES
(1, 'Gerente', 'Encargado del departamento de desarrollo, es quien vela por que el funcionamiento de dicho departamento sea el adecuado.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_rol`
--

CREATE TABLE `sigm_rol` (
  `ID_ROL` int NOT NULL,
  `DSC_NOMBRE` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DSC_ROL` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_rol`
--

INSERT INTO `sigm_rol` (`ID_ROL`, `DSC_NOMBRE`, `DSC_ROL`) VALUES
(1, 'Administrador', 'Usuario con acceso total al sistema, es capaz de administrar todo lo que hay en el.'),
(2, 'Asistente', 'Tiene acceso solo a las funcionalidades administrativas que respectan a la gestión del inventario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigm_usuario`
--

CREATE TABLE `sigm_usuario` (
  `ID_USUARIO` int NOT NULL,
  `ID_COLABORADOR` int DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ID_ROL` int DEFAULT NULL,
  `DSC_PASSWORD` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sigm_usuario`
--

INSERT INTO `sigm_usuario` (`ID_USUARIO`, `ID_COLABORADOR`, `DSC_NOMBRE`, `ID_ROL`, `DSC_PASSWORD`, `ESTADO`) VALUES
(1, 1, 'AdamAG124', 1, '$2b$10$RwK/N7hKAkrRLnuPvg9Yje60fZeAcbz9Ba5UyniqdQ/U0cQAn/kwy', 1),
(2, 2, 'KaroVG1622', 2, '$2b$10$wwGRKKQ4hqFqbFiytxhUgOuGV0UQJE6EagcKkEYCTctl27IwZgsLS', 1),
(3, 3, 'LuciaP3', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(4, 4, 'JuanG4', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(5, 5, 'MariaL555', 1, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 0),
(6, 6, 'DiegoH6', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 0),
(7, 7, 'AndreaM7', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(8, 8, 'CarlosJ8', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(9, 9, 'DianaG9', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(10, 10, 'FernandoC10', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(11, 11, 'AnaV11', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(12, 12, 'RobertoC12', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(13, 13, 'SofiaO13', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(14, 14, 'GabrielM14', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(15, 15, 'RaquelA15', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(16, 16, 'EstebanV16', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(17, 17, 'KarlaR17', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(18, 18, 'DanielN18', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1),
(19, 19, 'AliciaT19', 2, '$2b$10$Ej5Vj8GkTzK6grz.1JDy4O1oy6Z5yygpFOBhMLqQ.rpxIgN2w/qyC', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigt_factura_producto`
--

CREATE TABLE `sigt_factura_producto` (
  `ID_FACTURA_PRODUCTO` int NOT NULL,
  `ID_FACTURA` int DEFAULT NULL,
  `ID_PRODUCTO` int DEFAULT NULL,
  `NUM_CANTIDAD_ANTERIOR` double DEFAULT NULL,
  `NUM_CANTIDAD_ENTRANDO` double DEFAULT NULL,
  `MONTO_PRECIO_NUEVA` double DEFAULT NULL,
  `ID_USUARIO` int DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigt_salida`
--

CREATE TABLE `sigt_salida` (
  `ID_SALIDA` int NOT NULL,
  `ID_COLABORADOR_SACANDO` int DEFAULT NULL,
  `ID_COLABORADOR_RECIBIENDO` int DEFAULT NULL,
  `FEC_SALIDA` datetime DEFAULT NULL,
  `ID_USUARIO` int DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sigt_salida_producto`
--

CREATE TABLE `sigt_salida_producto` (
  `ID_SALIDA_PRODUCTO` int NOT NULL,
  `ID_PRODUCTO` int DEFAULT NULL,
  `ID_SALIDA` int DEFAULT NULL,
  `NUM_CANTIDAD_ANTERIOR` double DEFAULT NULL,
  `NUM_CANTIDAD_SALIENDO` double DEFAULT NULL,
  `NUM_CANTIDAD_NUEVA` double DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  ADD KEY `ID_CATEGORIA_PRODUCTO` (`ID_CATEGORIA_PRODUCTO`);

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
-- Indices de la tabla `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  ADD PRIMARY KEY (`ID_USUARIO`),
  ADD UNIQUE KEY `ID_COLABORADOR` (`ID_COLABORADOR`),
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
  MODIFY `ID_CATEGORIA_PRODUCTO` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigm_colaborador`
--
ALTER TABLE `sigm_colaborador`
  MODIFY `ID_COLABORADOR` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `sigm_comprobante_pago`
--
ALTER TABLE `sigm_comprobante_pago`
  MODIFY `ID_COMPROBANTE_PAGO` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigm_cuenta_bancaria`
--
ALTER TABLE `sigm_cuenta_bancaria`
  MODIFY `ID_CUENTA_BANCARIA` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigm_departamento`
--
ALTER TABLE `sigm_departamento`
  MODIFY `ID_DEPARTAMENTO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `sigm_entidad_financiera`
--
ALTER TABLE `sigm_entidad_financiera`
  MODIFY `ID_ENTIDAD_FINANCIERA` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigm_factura`
--
ALTER TABLE `sigm_factura`
  MODIFY `ID_FACTURA` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigm_producto`
--
ALTER TABLE `sigm_producto`
  MODIFY `ID_PRODUCTO` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigm_proveedor`
--
ALTER TABLE `sigm_proveedor`
  MODIFY `ID_PROVEEDOR` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigm_puesto_trabajo`
--
ALTER TABLE `sigm_puesto_trabajo`
  MODIFY `ID_PUESTO_TRABAJO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `sigm_rol`
--
ALTER TABLE `sigm_rol`
  MODIFY `ID_ROL` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  MODIFY `ID_USUARIO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `sigt_factura_producto`
--
ALTER TABLE `sigt_factura_producto`
  MODIFY `ID_FACTURA_PRODUCTO` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigt_salida`
--
ALTER TABLE `sigt_salida`
  MODIFY `ID_SALIDA` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sigt_salida_producto`
--
ALTER TABLE `sigt_salida_producto`
  MODIFY `ID_SALIDA_PRODUCTO` int NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `SIGM_PRODUCTO_ibfk_1` FOREIGN KEY (`ID_CATEGORIA_PRODUCTO`) REFERENCES `sigm_categoria_producto` (`ID_CATEGORIA_PRODUCTO`);

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
