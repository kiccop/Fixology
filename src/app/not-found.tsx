import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Bike, Home } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
    const t = useTranslations('errors');

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950">
            <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-8 animate-float">
                    <Bike className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-6xl font-bold mb-4 text-gradient">404</h1>
                <h2 className="text-2xl font-semibold mb-6">{t('notFound')}</h2>
                <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                    Ops! Sembra che questa strada non porti da nessuna parte. Torna sul sentiero principale.
                </p>
                <Link href="/">
                    <Button icon={<Home className="w-4 h-4" />}>
                        Torna alla Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
