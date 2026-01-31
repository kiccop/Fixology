'use client'

import { useState } from 'react'
// Final build trigger
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Modal, Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

const bikeSchema = z.object({
    name: z.string().min(1),
    brand: z.string(),
    model: z.string(),
    frame_type: z.enum(['road', 'mtb', 'gravel', 'city', 'ebike', 'other']),
    total_km: z.number().min(0),
    total_hours: z.number().min(0).optional(),
})

type BikeFormData = z.infer<typeof bikeSchema>

interface AddBikeModalProps {
    isOpen: boolean
    onClose: () => void
}

const frameTypes = [
    { value: 'road', label: 'Strada', emoji: '🚴' },
    { value: 'mtb', label: 'Mountain Bike', emoji: '🚵' },
    { value: 'gravel', label: 'Gravel', emoji: '🚴‍♂️' },
    { value: 'city', label: 'Città', emoji: '🚲' },
    { value: 'ebike', label: 'E-Bike', emoji: '⚡' },
    { value: 'other', label: 'Altro', emoji: '🚴' },
]

export function AddBikeModal({ isOpen, onClose }: AddBikeModalProps) {
    const t = useTranslations('bikes')
    const tCommon = useTranslations('common')
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BikeFormData>({
        resolver: zodResolver(bikeSchema),
        defaultValues: {
            name: '',
            brand: '',
            model: '',
            frame_type: 'road',
            total_km: 0,
        },
    })

    const selectedFrameType = watch('frame_type')

    const onSubmit = async (data: BikeFormData) => {
        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error(tCommon('error'))
                return
            }

            const { error } = await supabase.from('bikes').insert({
                user_id: user.id,
                name: data.name,
                brand: data.brand || null,
                model: data.model || null,
                frame_type: data.frame_type,
                total_km: data.total_km,
            })

            if (error) {
                toast.error(tCommon('error'))
                return
            }

            toast.success(tCommon('success'))
            reset()
            onClose()
            router.refresh()
        } catch {
            toast.error(tCommon('error'))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('addBike')} size="md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    label={t('bikeName')}
                    placeholder="Es. Bianchi Infinito"
                    error={errors.name?.message}
                    {...register('name')}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={t('brand')}
                        placeholder="Es. Bianchi"
                        {...register('brand')}
                    />
                    <Input
                        label={t('model')}
                        placeholder="Es. Infinito CV"
                        {...register('model')}
                    />
                </div>

                {/* Frame Type Selection */}
                <div>
                    <label className="label">{t('frameType')}</label>
                    <div className="grid grid-cols-3 gap-2">
                        {frameTypes.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setValue('frame_type', type.value as any)}
                                className={`
                  p-3 rounded-xl border text-center transition-all
                  ${selectedFrameType === type.value
                                        ? 'bg-primary-500/10 border-primary-500/50 text-primary-400'
                                        : 'bg-neutral-800/50 border-white/5 hover:border-white/10'
                                    }
                `}
                            >
                                <div className="text-2xl mb-1">{type.emoji}</div>
                                <div className="text-xs font-medium">{t(`frameTypes.${type.value}`)}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <Input
                    label={t('totalKm')}
                    type="number"
                    placeholder="0"
                    helperText="Km attuali della bici (opzionale se sincronizzi con Strava)"
                    {...register('total_km', { valueAsNumber: true })}
                />

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="ghost" fullWidth onClick={onClose}>
                        {tCommon('cancel')}
                    </Button>
                    <Button type="submit" fullWidth loading={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : tCommon('add')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
