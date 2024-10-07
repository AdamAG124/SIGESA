-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-10-2024 a las 00:25:16
-- Versión del servidor: 10.4.32-MariaDB
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
-- Estructura de tabla para la tabla `categoriaproducto`
--

CREATE TABLE `categoriaproducto` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colaborador`
--

CREATE TABLE `colaborador` (
  `id_colaborador` int(11) NOT NULL,
  `idDepartamento` int(11) DEFAULT NULL,
  `idPuesto` int(11) DEFAULT NULL,
  `segundoApellido` varchar(255) DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `numTelefono` varchar(20) DEFAULT NULL,
  `fechaIngreso` date DEFAULT NULL,
  `fechaSalida` date DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `primerApellido` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `colaborador`
--

INSERT INTO `colaborador` (`id_colaborador`, `idDepartamento`, `idPuesto`, `segundoApellido`, `fechaNacimiento`, `numTelefono`, `fechaIngreso`, `fechaSalida`, `estado`, `correo`, `cedula`, `nombre`, `primerApellido`) VALUES
(1, 1, 1, 'González', '2001-08-25', '63133860', '2022-09-01', NULL, 1, 'adam.acuna.gonzalez@est.una.ac.cr', '118200907A', 'Adam', 'Acuña');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobantepago`
--

CREATE TABLE `comprobantepago` (
  `id_comprobantePago` int(11) NOT NULL,
  `idEntidadFinanciera` int(11) DEFAULT NULL,
  `fechaPago` date DEFAULT NULL,
  `numero` varchar(255) DEFAULT NULL,
  `monto` double DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentabancaria`
--

CREATE TABLE `cuentabancaria` (
  `id_cuentaBancaria` int(11) NOT NULL,
  `idEntidadFinanciera` int(11) DEFAULT NULL,
  `banco` varchar(255) DEFAULT NULL,
  `numero` varchar(255) DEFAULT NULL,
  `divisa` varchar(10) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `id_departamento` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
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
  `id_entidadFinanciera` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `tipo` varchar(25) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id_factura` int(11) NOT NULL,
  `idProveedor` int(11) DEFAULT NULL,
  `idComprobante` int(11) DEFAULT NULL,
  `numeroFactura` varchar(255) DEFAULT NULL,
  `fechaFactura` date DEFAULT NULL,
  `detallesAdicionales` text DEFAULT NULL,
  `impuesto` double DEFAULT NULL,
  `descuento` double DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturaproducto`
--

CREATE TABLE `facturaproducto` (
  `id_facturaProducto` int(11) NOT NULL,
  `idFactura` int(11) DEFAULT NULL,
  `idProducto` int(11) DEFAULT NULL,
  `cantidadAnterior` double DEFAULT NULL,
  `cantidadEntrando` double DEFAULT NULL,
  `precioNueva` double DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `idCategoria` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `cantidad` double DEFAULT NULL,
  `unidadMedicion` varchar(50) NOT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_Proveedor` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `canton` varchar(255) DEFAULT NULL,
  `distrito` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puestotrabajo`
--

CREATE TABLE `puestotrabajo` (
  `id_puestoTrabajo` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
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
  `id_role` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `role_description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_role`, `role_name`, `role_description`) VALUES
(1, 'Administrador', 'Este rol le da acceso completo a las configuraciones del sistema al usuario'),
(2, 'Empleado', 'Este rol le da acceso limitado a las configuraciones del sistema al usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salida`
--

CREATE TABLE `salida` (
  `id_salida` int(11) NOT NULL,
  `colaboradorSacando` int(11) DEFAULT NULL,
  `colaboradorRecibiendo` int(11) DEFAULT NULL,
  `fechaSalida` datetime DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salidaproducto`
--

CREATE TABLE `salidaproducto` (
  `id_salidaProducto` int(11) NOT NULL,
  `id_Producto` int(11) DEFAULT NULL,
  `id_Salida` int(11) DEFAULT NULL,
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
  `id_Usuario` int(11) NOT NULL,
  `idColaborador` int(11) DEFAULT NULL,
  `nombreUsuario` varchar(255) DEFAULT NULL,
  `idRol` int(11) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_Usuario`, `idColaborador`, `nombreUsuario`, `idRol`, `password`, `estado`) VALUES
(1, 1, 'AdamAG124', 1, '$2b$12$Tb3t7ULvw.yISJnCQfClw.o.8GoHnBfBx1KUuogcx1xSckgBHmQei', 1);

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
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `colaborador`
--
ALTER TABLE `colaborador`
  MODIFY `id_colaborador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `comprobantepago`
--
ALTER TABLE `comprobantepago`
  MODIFY `id_comprobantePago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cuentabancaria`
--
ALTER TABLE `cuentabancaria`
  MODIFY `id_cuentaBancaria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `entidadfinanciera`
--
ALTER TABLE `entidadfinanciera`
  MODIFY `id_entidadFinanciera` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `facturaproducto`
--
ALTER TABLE `facturaproducto`
  MODIFY `id_facturaProducto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_Proveedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puestotrabajo`
--
ALTER TABLE `puestotrabajo`
  MODIFY `id_puestoTrabajo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `salida`
--
ALTER TABLE `salida`
  MODIFY `id_salida` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `salidaproducto`
--
ALTER TABLE `salidaproducto`
  MODIFY `id_salidaProducto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
