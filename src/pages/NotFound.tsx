import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4">
      <div className="text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Page introuvable</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
