import React from "react";
import type { Application } from '../../types';

interface CreateFormProps {
    application: Application | null
    onClose: () => void
    onCreateSuccess: () => void
    onError: (message: string | null) => void
}

const CreateForm: React.FC<CreateFormProps> = ({}) =>{
    return(
        <div>

        </div>
    )
}
