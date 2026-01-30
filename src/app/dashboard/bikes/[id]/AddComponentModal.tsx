'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'
import { Modal, Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_COMPONENTS, ComponentType } from '@/types'

const componentSchema = z.object({
    type: z.string().min(1),
    name: z.string(),
    install_km: z.number().min(0),
    install_hours: z.number().min(0),
    threshold_km: z.number().min(0).nullable(),
    threshold_hours: z.number().min(0).nullable(),
    notes: z.string(),
})

type ComponentFormData = z.infer<typeof componentSchema>

interface AddComponentModalProps {
    isOpen: boolean
    onClose: () => void
    bikeId: string
    currentBikeKm: number
}

export function AddComponentModal({
    isOpen,
    onClose,
    bikeId,
    currentBikeKm
}: AddComponentModalProps) {
    const t = useTranslations('components')
    const tCommon = useTranslations('common')
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<'select' | 'configure'>('select')
    const [isCustom, setIsCustom] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ComponentFormData>({
        resolver: zodResolver(componentSchema),
        defaultValues: {
            type: '',
            name: '',
            install_km: currentBikeKm,
            install_hours: 0,
            threshold_km: null,
            threshold_hours: null,
            notes: '',
        },
    })

    const selectedType = watch('type')

    const handleSelectComponent = (type: string, isCustomComponent: boolean = false) => {
        setIsCustom(isCustomComponent)
        setValue('type', type)

        if (!isCustomComponent) {
            const defaultConfig = DEFAULT_COMPONENTS.find(c => c.type === type)
            if (defaultConfig) {
                setValue('threshold_km', defaultConfig.defaultThresholdKm || null)
                setValue('threshold_hours', defaultConfig.defaultThresholdHours || null)
            }
        }

        setStep('configure')
    }

    const onSubmit = async (data: ComponentFormData) => {
        setIsLoading(true)
        try {
            const componentName = isCustom
                ? data.name
                : DEFAULT_COMPONENTS.find(c => c.type === data.type)?.nameIt || data.type

            const { error } = await supabase.from('components').insert({
                bike_id: bikeId,
                type: data.type,
                name: componentName,
                install_km: data.install_km,
                install_hours: data.install_hours,
                threshold_km: data.threshold_km || null,
                threshold_hours: data.threshold_hours || null,
                current_km: 0,
                current_hours: 0,
                notes: data.notes || null,
                is_custom: isCustom,
                status: 'ok',
                install_date: new Date().toISOString().split('T')[0],
            })

            // Also create initial maintenance log
            if (!error) {
                const { data: newComponent } = await supabase
                    .from('components')
                    .select('id')
                    .eq('bike_id', bikeId)
                    .eq('type', data.type)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                if (newComponent) {
                    await supabase.from('maintenance_logs').insert({
                        component_id: newComponent.id,
                        action_type: 'installed',
                        km_at_action: data.install_km,
                        hours_at_action: data.install_hours,
                    })
                }
            }

            if (error) {
                toast.error(tCommon('error'))
                return
            }

            toast.success(tCommon('success'))
            handleClose()
            router.refresh()
        } catch {
            toast.error(tCommon('error'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        reset()
        setStep('select')
        setIsCustom(false)
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={step === 'select' ? t('selectType') : t('addComponent')}
            size="lg"
        >
            {step === 'select' ? (
                <div className="space-y-4">
                    {/* Predefined Components */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
                        {DEFAULT_COMPONENTS.map((component) => (
                            <button
                                key={component.type}
                                type="button"
                                onClick={() => handleSelectComponent(component.type)}
                                className="p-3 rounded-xl border border-white/5 bg-neutral-800/50 hover:bg-neutral-700/50 hover:border-primary-500/30 transition-all text-left"
                            >
                                <div className="font-medium text-sm">{component.nameIt}</div>
                                <div className="text-xs text-neutral-500 mt-1">
                                    {component.defaultThresholdKm
                                        ? `~${component.defaultThresholdKm.toLocaleString()} km`
                                        : component.defaultThresholdHours
                                            ? `~${component.defaultThresholdHours}h`
                                            : ''
                                    }
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Custom Component Button */}
                    <button
                        type="button"
                        onClick={() => handleSelectComponent('custom', true)}
                        className="w-full p-4 rounded-xl border border-dashed border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5 text-primary-400" />
                        <span className="font-medium">{t('customComponent')}</span>
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Component Type Display */}
                    <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                        <p className="text-sm text-neutral-400">Tipo selezionato</p>
                        <p className="font-medium">
                            {isCustom
                                ? t('customComponent')
                                : DEFAULT_COMPONENTS.find(c => c.type === selectedType)?.nameIt || selectedType
                            }
                        </p>
                    </div>

                    {/* Custom Name (only for custom components) */}
                    {isCustom && (
                        <Input
                            label={t('customComponent')}
                            placeholder="..."
                            error={errors.name?.message}
                            {...register('name')}
                        />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('installKm')}
                            type="number"
                            placeholder="0"
                            helperText="Km della bici all'installazione"
                            {...register('install_km', { valueAsNumber: true })}
                        />
                        <Input
                            label={t('installHours')}
                            type="number"
                            placeholder="0"
                            helperText="Ore di utilizzo (opzionale)"
                            {...register('install_hours', { valueAsNumber: true })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('thresholdKm')}
                            type="number"
                            placeholder="0"
                            helperText="Km massimi prima della sostituzione"
                            {...register('threshold_km', { valueAsNumber: true })}
                        />
                        <Input
                            label={t('thresholdHours')}
                            type="number"
                            placeholder="0"
                            helperText="Ore massime (alternativo ai km)"
                            {...register('threshold_hours', { valueAsNumber: true })}
                        />
                    </div>

                    <div>
                        <label className="label">{t('notes')}</label>
                        <textarea
                            className="input min-h-[80px] resize-none"
                            placeholder="Note opzionali sul componente..."
                            {...register('notes')}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            fullWidth
                            onClick={() => setStep('select')}
                        >
                            {tCommon('back')}
                        </Button>
                        <Button type="submit" fullWidth loading={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : tCommon('add')}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
