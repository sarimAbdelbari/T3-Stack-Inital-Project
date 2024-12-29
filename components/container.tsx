import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = 
({ classname , children } :
    { classname?: string, children: React.ReactNode }
) => {
    return <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">{children}</div>;
};

export default Container;