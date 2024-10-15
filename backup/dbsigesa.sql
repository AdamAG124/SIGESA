-- Actualización hecha martes 15 de octubre a las 10:24 de la mañana por Adam Acuña
-- Solo agregue informacióin basura de colaboradores a la bd

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-10-2024 a las 18:23:14
-- Versión del servidor: 8.4.2
-- Versión de PHP: 8.2.4

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
-- Estructura de tabla para la tabla `categoriaproducto`
--

CREATE TABLE `categoriaproducto` (
  `id_categoria` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colaborador`
--

CREATE TABLE `colaborador` (
  `id_colaborador` int NOT NULL,
  `idDepartamento` int DEFAULT NULL,
  `idPuesto` int DEFAULT NULL,
  `segundoApellido` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `numTelefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fechaIngreso` date DEFAULT NULL,
  `fechaSalida` date DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `correo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primerApellido` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `colaborador`
--

INSERT INTO `colaborador` (`id_colaborador`, `idDepartamento`, `idPuesto`, `segundoApellido`, `fechaNacimiento`, `numTelefono`, `fechaIngreso`, `fechaSalida`, `estado`, `correo`, `cedula`, `nombre`, `primerApellido`) VALUES
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
-- Estructura de tabla para la tabla `comprobantepago`
--

CREATE TABLE `comprobantepago` (
  `id_comprobantePago` int NOT NULL,
  `idEntidadFinanciera` int DEFAULT NULL,
  `fechaPago` date DEFAULT NULL,
  `numero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monto` double DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentabancaria`
--

CREATE TABLE `cuentabancaria` (
  `id_cuentaBancaria` int NOT NULL,
  `idEntidadFinanciera` int DEFAULT NULL,
  `banco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `divisa` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `id_departamento` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `departamento`
--

INSERT INTO `departamento` (`id_departamento`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Desarrollo', 'El departamento de desarrollo es el encargado de gestionar todo lo relacionado a la técnología dentro de la organización.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entidadfinanciera`
--

CREATE TABLE `entidadfinanciera` (
  `id_entidadFinanciera` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id_factura` int NOT NULL,
  `idProveedor` int DEFAULT NULL,
  `idComprobante` int DEFAULT NULL,
  `numeroFactura` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fechaFactura` date DEFAULT NULL,
  `detallesAdicionales` text COLLATE utf8mb4_unicode_ci,
  `impuesto` double DEFAULT NULL,
  `descuento` double DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturaproducto`
--

CREATE TABLE `facturaproducto` (
  `id_facturaProducto` int NOT NULL,
  `idFactura` int DEFAULT NULL,
  `idProducto` int DEFAULT NULL,
  `cantidadAnterior` double DEFAULT NULL,
  `cantidadEntrando` double DEFAULT NULL,
  `precioNueva` double DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int NOT NULL,
  `idCategoria` int DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `cantidad` double DEFAULT NULL,
  `unidadMedicion` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_Proveedor` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provincia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `canton` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distrito` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puestotrabajo`
--

CREATE TABLE `puestotrabajo` (
  `id_puestoTrabajo` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `puestotrabajo`
--

INSERT INTO `puestotrabajo` (`id_puestoTrabajo`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Gerente', 'Encargado del departamento de desarrollo, es quien vela por que el funcionamiento de dicho departamento sea el adecuado.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_role` int NOT NULL,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_description` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_role`, `role_name`, `role_description`) VALUES
(1, 'Administrador', 'Usuario con acceso total al sistema, es capaz de administrar todo lo que hay en el.'),
(2, 'Asistente', 'Tiene acceso solo a las funcionalidades administrativas que respectan a la gestión del inventario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salida`
--

CREATE TABLE `salida` (
  `id_salida` int NOT NULL,
  `colaboradorSacando` int DEFAULT NULL,
  `colaboradorRecibiendo` int DEFAULT NULL,
  `fechaSalida` datetime DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salidaproducto`
--

CREATE TABLE `salidaproducto` (
  `id_salidaProducto` int NOT NULL,
  `id_Producto` int DEFAULT NULL,
  `id_Salida` int DEFAULT NULL,
  `cantidadAnterior` double DEFAULT NULL,
  `cantidadSaliendo` double DEFAULT NULL,
  `cantidadNueva` double DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_Usuario` int NOT NULL,
  `idColaborador` int DEFAULT NULL,
  `nombreUsuario` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idRol` int DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_Usuario`, `idColaborador`, `nombreUsuario`, `idRol`, `password`, `estado`) VALUES
(1, 1, 'AdamAG124', 1, '$2b$10$RwK/N7hKAkrRLnuPvg9Yje60fZeAcbz9Ba5UyniqdQ/U0cQAn/kwy', 0),
(2, 2, 'KaroVG1622', 2, '$2b$10$wwGRKKQ4hqFqbFiytxhUgOuGV0UQJE6EagcKkEYCTctl27IwZgsLS', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoriaproducto`
--
ALTER TABLE `categoriaproducto`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `colaborador`
--
ALTER TABLE `colaborador`
  ADD PRIMARY KEY (`id_colaborador`),
  ADD KEY `idDepartamento` (`idDepartamento`),
  ADD KEY `idPuesto` (`idPuesto`);

--
-- Indices de la tabla `comprobantepago`
--
ALTER TABLE `comprobantepago`
  ADD PRIMARY KEY (`id_comprobantePago`),
  ADD KEY `idEntidadFinanciera` (`idEntidadFinanciera`);

--
-- Indices de la tabla `cuentabancaria`
--
ALTER TABLE `cuentabancaria`
  ADD PRIMARY KEY (`id_cuentaBancaria`),
  ADD KEY `idEntidadFinanciera` (`idEntidadFinanciera`);

--
-- Indices de la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD PRIMARY KEY (`id_departamento`);

--
-- Indices de la tabla `entidadfinanciera`
--
ALTER TABLE `entidadfinanciera`
  ADD PRIMARY KEY (`id_entidadFinanciera`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `idProveedor` (`idProveedor`),
  ADD KEY `idComprobante` (`idComprobante`);

--
-- Indices de la tabla `facturaproducto`
--
ALTER TABLE `facturaproducto`
  ADD PRIMARY KEY (`id_facturaProducto`),
  ADD KEY `idFactura` (`idFactura`),
  ADD KEY `idProducto` (`idProducto`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `idCategoria` (`idCategoria`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_Proveedor`);

--
-- Indices de la tabla `puestotrabajo`
--
ALTER TABLE `puestotrabajo`
  ADD PRIMARY KEY (`id_puestoTrabajo`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_role`);

--
-- Indices de la tabla `salida`
--
ALTER TABLE `salida`
  ADD PRIMARY KEY (`id_salida`),
  ADD KEY `colaboradorSacando` (`colaboradorSacando`),
  ADD KEY `colaboradorRecibiendo` (`colaboradorRecibiendo`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `salidaproducto`
--
ALTER TABLE `salidaproducto`
  ADD PRIMARY KEY (`id_salidaProducto`),
  ADD KEY `id_Producto` (`id_Producto`),
  ADD KEY `id_Salida` (`id_Salida`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_Usuario`),
  ADD UNIQUE KEY `idColaborador` (`idColaborador`),
  ADD KEY `FK_ROLE` (`idRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoriaproducto`
--
ALTER TABLE `categoriaproducto`
  MODIFY `id_categoria` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `colaborador`
--
ALTER TABLE `colaborador`
  MODIFY `id_colaborador` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `comprobantepago`
--
ALTER TABLE `comprobantepago`
  MODIFY `id_comprobantePago` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cuentabancaria`
--
ALTER TABLE `cuentabancaria`
  MODIFY `id_cuentaBancaria` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `id_departamento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `entidadfinanciera`
--
ALTER TABLE `entidadfinanciera`
  MODIFY `id_entidadFinanciera` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id_factura` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `facturaproducto`
--
ALTER TABLE `facturaproducto`
  MODIFY `id_facturaProducto` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_Proveedor` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puestotrabajo`
--
ALTER TABLE `puestotrabajo`
  MODIFY `id_puestoTrabajo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `salida`
--
ALTER TABLE `salida`
  MODIFY `id_salida` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `salidaproducto`
--
ALTER TABLE `salidaproducto`
  MODIFY `id_salidaProducto` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_Usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `colaborador`
--
ALTER TABLE `colaborador`
  ADD CONSTRAINT `colaborador_ibfk_1` FOREIGN KEY (`idDepartamento`) REFERENCES `departamento` (`id_departamento`),
  ADD CONSTRAINT `colaborador_ibfk_2` FOREIGN KEY (`idPuesto`) REFERENCES `puestotrabajo` (`id_puestoTrabajo`);

--
-- Filtros para la tabla `comprobantepago`
--
ALTER TABLE `comprobantepago`
  ADD CONSTRAINT `comprobantepago_ibfk_1` FOREIGN KEY (`idEntidadFinanciera`) REFERENCES `entidadfinanciera` (`id_entidadFinanciera`);

--
-- Filtros para la tabla `cuentabancaria`
--
ALTER TABLE `cuentabancaria`
  ADD CONSTRAINT `cuentabancaria_ibfk_1` FOREIGN KEY (`idEntidadFinanciera`) REFERENCES `entidadfinanciera` (`id_entidadFinanciera`);

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`idProveedor`) REFERENCES `proveedor` (`id_Proveedor`),
  ADD CONSTRAINT `factura_ibfk_2` FOREIGN KEY (`idComprobante`) REFERENCES `comprobantepago` (`id_comprobantePago`);

--
-- Filtros para la tabla `facturaproducto`
--
ALTER TABLE `facturaproducto`
  ADD CONSTRAINT `facturaproducto_ibfk_1` FOREIGN KEY (`idFactura`) REFERENCES `factura` (`id_factura`),
  ADD CONSTRAINT `facturaproducto_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `facturaproducto_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_Usuario`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`idCategoria`) REFERENCES `categoriaproducto` (`id_categoria`);

--
-- Filtros para la tabla `salida`
--
ALTER TABLE `salida`
  ADD CONSTRAINT `salida_ibfk_1` FOREIGN KEY (`colaboradorSacando`) REFERENCES `colaborador` (`id_colaborador`),
  ADD CONSTRAINT `salida_ibfk_2` FOREIGN KEY (`colaboradorRecibiendo`) REFERENCES `colaborador` (`id_colaborador`),
  ADD CONSTRAINT `salida_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_Usuario`);

--
-- Filtros para la tabla `salidaproducto`
--
ALTER TABLE `salidaproducto`
  ADD CONSTRAINT `salidaproducto_ibfk_1` FOREIGN KEY (`id_Producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `salidaproducto_ibfk_2` FOREIGN KEY (`id_Salida`) REFERENCES `salida` (`id_salida`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idColaborador`) REFERENCES `colaborador` (`id_colaborador`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id_role`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
