import { useForm, type RegisterOptions } from 'react-hook-form';

export interface FarmForm {
    name: string;
    vereda: string;
    municipio: string;
    altitude: string;
}

export const farmFormRules: { [K in keyof FarmForm]: RegisterOptions<FarmForm> } = {
    name: {
        required: 'El nombre de la finca es obligatorio',
        maxLength: { value: 100, message: 'El nombre debe tener máximo 100 caracteres' },
    },
    vereda: {
        maxLength: { value: 100, message: 'La vereda debe tener máximo 100 caracteres' },
    },
    municipio: {
        maxLength: { value: 100, message: 'El municipio debe tener máximo 100 caracteres' },
    },
    altitude: {
        required: 'La altitud es obligatoria',
        validate: (value) =>
            (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) ||
            'Ingresa una altitud numérica válida mayor o igual a 0',
    },
};

export function useFarmForm() {
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<FarmForm>();

    return { control, handleSubmit, reset, setError, errors };
}
