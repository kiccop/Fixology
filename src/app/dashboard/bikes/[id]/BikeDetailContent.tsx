'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Bike,
    Plus,
    Settings,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    MoreVertical,
    Star,
    Edit,
    Trash2,
    RotateCcw,
} from 'lucide-react'
import { Card, Button, ProgressBar, Badge, Modal } from '@/components/ui'
import { AddComponentModal } from './AddComponentModal'
import { createClient } from '@/lib/supabase/client'

interface BikeDetailContentProps {
    bike: any
}

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
}

export function BikeDetailContent({ bike }: BikeDetailContentProps) {
    const t = useTranslations('components')
    const tBikes = useTranslations('bikes')
    const router = useRouter()
    const supabase = createClient()

    const [addComponentOpen, setAddComponentOpen] = useState(false)
    const [selectedComponent, setSelectedComponent] = useState<any>(null)
    const [actionModalOpen, setActionModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const components = bike.components || []
    const activeComponents = components.filter((c: any) => c.status !== 'replaced')
    const replacedComponents = components.filter((c: any) => c.status === 'replaced')

    const handleResetComponent = async (component: any) => {
        setIsLoading(true)
        try {
            // Create maintenance log for replacement
            await supabase.from('maintenance_logs').insert({
                component_id: component.id,
                action_type: 'replaced',
                km_at_action: component.current_km + component.install_km,
                hours_at_action: component.current_hours + component.install_hours,
            })

            // Reset component
            await supabase
                .from('components')
                .update({
                    install_km: bike.total_km,
                    install_hours: bike.total_hours || 0,
                    current_km: 0,
                    current_hours: 0,
                    status: 'ok',
                    install_date: new Date().toISOString().split('T')[0],
                })
                .eq('id', component.id)

            toast.success('Componente resettato')
            router.refresh()
        } catch {
            toast.error('Errore durante il reset')
        } finally {
            setIsLoading(false)
            setActionModalOpen(false)
            setSelectedComponent(null)
        }
    }

    const handleDeleteComponent = async (component: any) => {
        setIsLoading(true)
        try {
            await supabase.from('components').delete().eq('id', component.id)
            toast.success('Componente eliminato')
            router.refresh()
        } catch {
            toast.error('Errore durante l\'eliminazione')
        } finally {
            setIsLoading(false)
            setActionModalOpen(false)
            setSelectedComponent(null)
        }
    }

    const calculateWear = (component: any) => {
        if (component.threshold_km && component.threshold_km > 0) {
            return (component.current_km / component.threshold_km) * 100
        }
        if (component.threshold_hours && component.threshold_hours > 0) {
            return (component.current_hours / component.threshold_hours) * 100
        }
        return 0
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={{
                animate: { transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={fadeIn}>
                <Link
                    href="/dashboard/bikes"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-100 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Torna alle bici</span>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                            <Bike className="w-8 h-8 text-primary-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl lg:text-3xl font-bold">{bike.name}</h1>
                                {bike.is_primary && (
                                    <Star className="w-5 h-5 text-warning-400 fill-warning-400" />
                                )}
                            </div>
                            <p className="text-neutral-400">
                                {bike.brand} {bike.model} • {bike.total_km?.toLocaleString() || 0} km
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => setAddComponentOpen(true)}
                        icon={<Plus className="w-4 h-4" />}
                    >
                        {t('addComponent')}
                    </Button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-neutral-400">Componenti</p>
                        <p className="text-2xl font-bold">{activeComponents.length}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-neutral-400">OK</p>
                        <p className="text-2xl font-bold text-success-400">
                            {activeComponents.filter((c: any) => c.status === 'ok').length}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-neutral-400">Attenzione</p>
                        <p className="text-2xl font-bold text-warning-400">
                            {activeComponents.filter((c: any) => c.status === 'warning').length}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-neutral-400">Da sostituire</p>
                        <p className="text-2xl font-bold text-danger-400">
                            {activeComponents.filter((c: any) => c.status === 'danger').length}
                        </p>
                    </div>
                </Card>
            </motion.div>

            {/* Components List */}
            <motion.div variants={fadeIn}>
                <Card padding="none">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary-400" />
                            {t('title')}
                        </h2>
                    </div>

                    {activeComponents.length === 0 ? (
                        <div className="p-8 text-center">
                            <Settings className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
                            <p className="text-neutral-400 mb-4">{t('noComponentsDescription')}</p>
                            <Button
                                onClick={() => setAddComponentOpen(true)}
                                icon={<Plus className="w-4 h-4" />}
                            >
                                {t('addComponent')}
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {activeComponents.sort((a: any, b: any) => {
                                const order = { danger: 0, warning: 1, ok: 2 }
                                return (order[a.status as keyof typeof order] || 3) - (order[b.status as keyof typeof order] || 3)
                            }).map((component: any) => {
                                const wear = calculateWear(component)

                                return (
                                    <div
                                        key={component.id}
                                        className="p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center
                          ${component.status === 'danger'
                                                        ? 'bg-danger-500/20 text-danger-400'
                                                        : component.status === 'warning'
                                                            ? 'bg-warning-500/20 text-warning-400'
                                                            : 'bg-success-500/20 text-success-400'
                                                    }
                        `}>
                                                    {component.status === 'danger' ? (
                                                        <AlertTriangle className="w-5 h-5" />
                                                    ) : (
                                                        <CheckCircle className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{t(`types.${component.type}`)}</h3>
                                                    <p className="text-sm text-neutral-400">
                                                        {component.current_km} km / {component.threshold_km || '∞'} km
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge status={component.status}>
                                                    {t(`status.${component.status}`)}
                                                </Badge>
                                                <button
                                                    onClick={() => {
                                                        setSelectedComponent(component)
                                                        setActionModalOpen(true)
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-neutral-400" />
                                                </button>
                                            </div>
                                        </div>

                                        <ProgressBar
                                            value={wear}
                                            showLabel
                                            size="sm"
                                        />

                                        {component.notes && (
                                            <p className="mt-2 text-sm text-neutral-500 italic">
                                                {component.notes}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Replaced Components History */}
            {replacedComponents.length > 0 && (
                <motion.div variants={fadeIn}>
                    <Card padding="none">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-lg font-semibold text-neutral-400">
                                Componenti sostituiti ({replacedComponents.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-white/5 opacity-60">
                            {replacedComponents.map((component: any) => (
                                <div key={component.id} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span>{t(`types.${component.type}`)}</span>
                                        <Badge status="replaced">Sostituito</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Add Component Modal */}
            <AddComponentModal
                isOpen={addComponentOpen}
                onClose={() => setAddComponentOpen(false)}
                bikeId={bike.id}
                currentBikeKm={bike.total_km || 0}
            />

            {/* Component Action Modal */}
            <Modal
                isOpen={actionModalOpen}
                onClose={() => {
                    setActionModalOpen(false)
                    setSelectedComponent(null)
                }}
                title={selectedComponent ? t(`types.${selectedComponent.type}`) : ''}
                size="sm"
            >
                {selectedComponent && (
                    <div className="space-y-3">
                        <button
                            onClick={() => handleResetComponent(selectedComponent)}
                            disabled={isLoading}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5 text-primary-400" />
                            <div className="text-left">
                                <p className="font-medium">{t('resetComponent')}</p>
                                <p className="text-sm text-neutral-400">Segna come sostituito e azzera i km</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleDeleteComponent(selectedComponent)}
                            disabled={isLoading}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-danger-500/10 text-danger-400 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                            <div className="text-left">
                                <p className="font-medium">Elimina</p>
                                <p className="text-sm opacity-70">Rimuovi definitivamente</p>
                            </div>
                        </button>
                    </div>
                )}
            </Modal>
        </motion.div>
    )
}
