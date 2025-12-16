import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, FileSignature, User, Calendar, CreditCard, Repeat2, MapPin, Clock, AlertCircle, FileText } from "lucide-react";
import { base44 } from '@/api/base44Client';

const ResumenEntregaCard = ({ datos = {}, onReiniciar, usuarios = [] }) => {
    const infoVehiculo = datos.paso1?.inspeccionExterior?.vehiculo || {};
    const confirmacion = datos.confirmacionEntrega || {};
    const inspeccionId = datos.informacionId;

    const getNombreUsuario = (conductorId) => {
        if (!conductorId) return 'No asignado';
        const conductor = usuarios.find(u => u.id === conductorId || u.conductorId === conductorId);
        return conductor?.nombre || conductor?.nombreCompleto || `Usuario ID: ${conductorId}`;
    };

    const nombreEntrega = getNombreUsuario(confirmacion.EntregaPersonaId);
    const nombreRecibe = getNombreUsuario(confirmacion.ConductorId);

    const formatKm = (km) => {
        return km ? `${Number(km).toLocaleString('es-PE')} km` : 'N/A';
    };

    const fechaEntrega = new Date().toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const handleVisualizarPDF = () => {
        if (!inspeccionId) {
            alert("No se puede generar el PDF: ID de inspección no disponible.");
            return;
        }

        try {
            base44.entities.SistemaEntrega.visualizarPDF(inspeccionId);
        } catch (error) {
            console.error("Error al intentar abrir el PDF de la API:", error);
            alert("❌ Error al solicitar el PDF. Revisa la consola para más detalles.");
        }
    };

    const SafeBadge = ({ className, children }) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${className}`}>
            {children}
        </span>
    );

    return (
        <Card className="w-full max-w-4xl border-gray-300 shadow-lg bg-white">
            <CardHeader className="bg-gray-100 border-b border-gray-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-3">
                            <Car className="w-6 h-6 flex-shrink-0" />
                            <span className="truncate">
                                Resumen de Entrega: {infoVehiculo.modelo || 'Vehículo Desconocido'}
                            </span>
                        </CardTitle>
                        <CardDescription className="text-sm md:text-md mt-2 flex flex-wrap gap-2 items-center">
                            <span>Inspección ID:</span>
                            <SafeBadge className="bg-gray-200 text-gray-800 font-mono">
                                {datos.informacionId || 'Pendiente'}
                            </SafeBadge>
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{fechaEntrega}</span>
                        </div>
                    </div>

                    <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleVisualizarPDF}
                    >
                        <FileText className="w-4 h-4" />
                        Ver Informe PDF
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            Detalles del Vehículo
                        </h3>
                        <div className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Placas:</span>
                                <span className="font-semibold">{infoVehiculo.placas || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">VIN:</span>
                                <span className="font-mono text-xs">{infoVehiculo.vin || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Kilometraje:</span>
                                <span className="font-semibold">{formatKm(datos.paso4?.kilometraje)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Nivel de Gasolina:</span>
                                <SafeBadge className="bg-gray-200 text-gray-700 border border-gray-300">
                                    {datos.paso4?.nivelGasolina || 'N/A'}
                                </SafeBadge>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Ubicación GPS:</span>
                                <span className="text-xs text-gray-500">[Coordenadas simuladas]</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base md:text-lg font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                            Detalles de la Transacción
                        </h3>
                        <div className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Tipo de Entrega:</span>
                                <SafeBadge className="capitalize bg-gray-200 text-gray-800">
                                    {confirmacion.TipoEntrega || 'N/A'}
                                </SafeBadge>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Credit ID:</span>
                                <span className="font-mono text-xs">{confirmacion.CreditId || 'N/A'}</span>
                            </div>
                            {confirmacion.FechaDevolucionOpcional && (
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">F. Devolución Est.:</span>
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(confirmacion.FechaDevolucionOpcional).toLocaleDateString('es-PE')}
                                    </span>
                                </div>
                            )}
                        </div>
                        {confirmacion.Notas && (
                            <div className="mt-4">
                                <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-gray-600" />
                                    Observaciones:
                                </p>
                                <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                                    {confirmacion.Notas}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-600" />
                            Actores Involucrados
                        </h3>
                        <div className="mt-3 space-y-3">
                            <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                                <p className="font-semibold text-sm text-gray-700">Responsable de Entrega:</p>
                                <p className="text-sm mt-1">{nombreEntrega}</p>
                            </div>
                            <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                                <p className="font-semibold text-sm text-gray-700">Receptor del Vehículo:</p>
                                <p className="text-sm mt-1">{nombreRecibe}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base md:text-lg font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <FileSignature className="w-5 h-5 text-gray-600" />
                            Firma Digital
                        </h3>
                        <div className="mt-3 p-4 border-2 border-gray-300 rounded-lg bg-white shadow-inner">
                            <p className="text-sm font-medium mb-2">Firma del Responsable:</p>
                            {confirmacion.FirmaEntregaData && confirmacion.FirmaEntregaData.startsWith('data:image') ? (
                                <div>
                                    <img
                                        src={confirmacion.FirmaEntregaData}
                                        alt="Firma digital del responsable de entrega"
                                        className="w-full h-32 object-contain border-b border-dashed border-gray-400 bg-white"
                                    />
                                    <p className="text-xs text-gray-700 mt-2 text-center flex items-center justify-center gap-1">
                                        ✓ Certificada y almacenada en Base64
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-700 text-sm">Firma No Registrada</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

            <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-xs text-gray-500">
                    Documento generado automáticamente por el sistema de gestión de vehículos
                </p>
                <Button
                    onClick={onReiniciar}
                    className="bg-gray-700 hover:bg-gray-800 text-white shadow-lg w-full sm:w-auto"
                >
                    <Repeat2 className="w-4 h-4 mr-2" />
                    Reiniciar Flujo
                </Button>
            </div>
        </Card>
    );
};

export default ResumenEntregaCard;