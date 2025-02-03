import { cn } from '@/lib/utils';
import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container: React.FC<ContainerProps> = 
({ className , children } :
    { className?: string, children: React.ReactNode }
) => {
    return <div className={cn("mx-auto w-full max-w-screen-2xl px-7 md:px-20}",className)}>{children}</div>;
};

export default Container;