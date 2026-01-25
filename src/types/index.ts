// ============================================
// Database Types
// ============================================

export interface User {
    id: string
    email: string
    name: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
}

export interface StravaToken {
    id: string
    user_id: string
    access_token: string
    refresh_token: string
    expires_at: number
    athlete_id: number
    created_at: string
    updated_at: string
}

export interface Bike {
    id: string
    user_id: string
    strava_id: string | null
    name: string
    brand: string | null
    model: string | null
    total_km: number
    is_primary: boolean
    frame_type: 'road' | 'mtb' | 'gravel' | 'city' | 'ebike' | 'other'
    image_url: string | null
    last_synced: string | null
    created_at: string
    updated_at: string
}

export interface Component {
    id: string
    bike_id: string
    name: string
    type: ComponentType
    install_date: string
    install_km: number
    install_hours: number
    threshold_km: number | null
    threshold_hours: number | null
    current_km: number
    current_hours: number
    status: ComponentStatus
    notes: string | null
    is_custom: boolean
    icon: string | null
    created_at: string
    updated_at: string
}

export interface MaintenanceLog {
    id: string
    component_id: string
    action_type: MaintenanceAction
    date: string
    km_at_action: number
    hours_at_action: number
    notes: string | null
    cost: number | null
    created_at: string
}

// ============================================
// Enums
// ============================================

export type ComponentType =
    | 'chain'           // Catena
    | 'cassette'        // Cassetta pignoni
    | 'chainring'       // Corona/Guarnitura
    | 'tire_front'      // Pneumatico anteriore
    | 'tire_rear'       // Pneumatico posteriore
    | 'brake_pads'      // Pastiglie freno
    | 'brake_cable'     // Cavi freno
    | 'shift_cable'     // Cavi cambio
    | 'jockey_wheels'   // Pulegge cambio
    | 'bar_tape'        // Nastro manubrio
    | 'handlebar'       // Manubrio
    | 'saddle'          // Sella
    | 'pedals'          // Pedali
    | 'cleats'          // Tacchette
    | 'bottom_bracket'  // Movimento centrale
    | 'headset'         // Serie sterzo
    | 'hubs'            // Mozzi
    | 'wheels'          // Ruote
    | 'suspension_fork' // Forcella ammortizzata
    | 'rear_shock'      // Ammortizzatore posteriore
    | 'dropper_post'    // Reggisella telescopico
    | 'custom'          // Componente personalizzato

export type ComponentStatus = 'ok' | 'warning' | 'danger' | 'replaced'

export type MaintenanceAction = 'installed' | 'maintained' | 'replaced' | 'inspected'

// ============================================
// Default Component Configurations
// ============================================

export interface DefaultComponentConfig {
    type: ComponentType
    name: string
    nameIt: string
    nameEn: string
    nameFr: string
    nameEs: string
    defaultThresholdKm: number
    defaultThresholdHours: number | null
    icon: string
    description: string
}

export const DEFAULT_COMPONENTS: DefaultComponentConfig[] = [
    {
        type: 'chain',
        name: 'Chain',
        nameIt: 'Catena',
        nameEn: 'Chain',
        nameFr: 'Chaîne',
        nameEs: 'Cadena',
        defaultThresholdKm: 4000,
        defaultThresholdHours: null,
        icon: 'link',
        description: 'Replace when stretched beyond 0.75%'
    },
    {
        type: 'cassette',
        name: 'Cassette',
        nameIt: 'Cassetta pignoni',
        nameEn: 'Cassette',
        nameFr: 'Cassette',
        nameEs: 'Casete',
        defaultThresholdKm: 12000,
        defaultThresholdHours: null,
        icon: 'cog',
        description: 'Replace every 2-3 chains'
    },
    {
        type: 'chainring',
        name: 'Chainring',
        nameIt: 'Corona/Guarnitura',
        nameEn: 'Chainring',
        nameFr: 'Plateau',
        nameEs: 'Plato',
        defaultThresholdKm: 18000,
        defaultThresholdHours: null,
        icon: 'sun',
        description: 'Replace when teeth are worn'
    },
    {
        type: 'tire_front',
        name: 'Front Tire',
        nameIt: 'Pneumatico anteriore',
        nameEn: 'Front Tire',
        nameFr: 'Pneu avant',
        nameEs: 'Neumático delantero',
        defaultThresholdKm: 5000,
        defaultThresholdHours: null,
        icon: 'circle',
        description: 'Check tread depth and sidewall condition'
    },
    {
        type: 'tire_rear',
        name: 'Rear Tire',
        nameIt: 'Pneumatico posteriore',
        nameEn: 'Rear Tire',
        nameFr: 'Pneu arrière',
        nameEs: 'Neumático trasero',
        defaultThresholdKm: 4000,
        defaultThresholdHours: null,
        icon: 'circle',
        description: 'Rear tires wear faster than front'
    },
    {
        type: 'brake_pads',
        name: 'Brake Pads',
        nameIt: 'Pastiglie freno',
        nameEn: 'Brake Pads',
        nameFr: 'Plaquettes de frein',
        nameEs: 'Pastillas de freno',
        defaultThresholdKm: 2000,
        defaultThresholdHours: null,
        icon: 'disc',
        description: 'Check thickness regularly'
    },
    {
        type: 'brake_cable',
        name: 'Brake Cables',
        nameIt: 'Cavi freno',
        nameEn: 'Brake Cables',
        nameFr: 'Câbles de frein',
        nameEs: 'Cables de freno',
        defaultThresholdKm: 7000,
        defaultThresholdHours: null,
        icon: 'cable',
        description: 'Replace when frayed or sluggish'
    },
    {
        type: 'shift_cable',
        name: 'Shift Cables',
        nameIt: 'Cavi cambio',
        nameEn: 'Shift Cables',
        nameFr: 'Câbles de dérailleur',
        nameEs: 'Cables de cambio',
        defaultThresholdKm: 7000,
        defaultThresholdHours: null,
        icon: 'cable',
        description: 'Replace when shifting becomes poor'
    },
    {
        type: 'jockey_wheels',
        name: 'Jockey Wheels',
        nameIt: 'Pulegge cambio',
        nameEn: 'Jockey Wheels',
        nameFr: 'Galets de dérailleur',
        nameEs: 'Rodillos del cambio',
        defaultThresholdKm: 12000,
        defaultThresholdHours: null,
        icon: 'settings',
        description: 'Replace when teeth are worn or noisy'
    },
    {
        type: 'bar_tape',
        name: 'Bar Tape',
        nameIt: 'Nastro manubrio',
        nameEn: 'Bar Tape',
        nameFr: 'Ruban de guidon',
        nameEs: 'Cinta de manillar',
        defaultThresholdKm: 4000,
        defaultThresholdHours: null,
        icon: 'grip-horizontal',
        description: 'Replace when worn or dirty'
    },
    {
        type: 'bottom_bracket',
        name: 'Bottom Bracket',
        nameIt: 'Movimento centrale',
        nameEn: 'Bottom Bracket',
        nameFr: 'Boîtier de pédalier',
        nameEs: 'Pedalier',
        defaultThresholdKm: 15000,
        defaultThresholdHours: null,
        icon: 'rotate-cw',
        description: 'Replace when creaking or rough'
    },
    {
        type: 'cleats',
        name: 'Cleats',
        nameIt: 'Tacchette',
        nameEn: 'Cleats',
        nameFr: 'Cales',
        nameEs: 'Calas',
        defaultThresholdKm: 8000,
        defaultThresholdHours: null,
        icon: 'footprints',
        description: 'Replace when release becomes unpredictable'
    },
    {
        type: 'suspension_fork',
        name: 'Suspension Fork Service',
        nameIt: 'Tagliando forcella',
        nameEn: 'Suspension Fork Service',
        nameFr: 'Révision fourche',
        nameEs: 'Revisión horquilla',
        defaultThresholdKm: 0,
        defaultThresholdHours: 100,
        icon: 'move-vertical',
        description: 'Lower leg service every 50-100h'
    },
    {
        type: 'rear_shock',
        name: 'Rear Shock Service',
        nameIt: 'Tagliando ammortizzatore',
        nameEn: 'Rear Shock Service',
        nameFr: 'Révision amortisseur',
        nameEs: 'Revisión amortiguador',
        defaultThresholdKm: 0,
        defaultThresholdHours: 100,
        icon: 'move-vertical',
        description: 'Air can service every 50-100h'
    },
]

// ============================================
// Strava Types
// ============================================

export interface StravaAthlete {
    id: number
    username: string
    firstname: string
    lastname: string
    profile: string
    profile_medium: string
    bikes: StravaBike[]
}

export interface StravaBike {
    id: string
    primary: boolean
    name: string
    distance: number // in meters
    brand_name: string | null
    model_name: string | null
    frame_type: number // 1=MTB, 2=Cross, 3=Road, 4=TT, 5=Other
}

export interface StravaTokenResponse {
    token_type: string
    expires_at: number
    expires_in: number
    refresh_token: string
    access_token: string
    athlete: StravaAthlete
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
}

// ============================================
// Form Types
// ============================================

export interface LoginFormData {
    email: string
    password: string
}

export interface RegisterFormData {
    email: string
    password: string
    confirmPassword: string
    name: string
}

export interface BikeFormData {
    name: string
    brand: string
    model: string
    frame_type: Bike['frame_type']
    total_km: number
}

export interface ComponentFormData {
    name: string
    type: ComponentType
    install_date: string
    install_km: number
    install_hours: number
    threshold_km: number | null
    threshold_hours: number | null
    notes: string
}
