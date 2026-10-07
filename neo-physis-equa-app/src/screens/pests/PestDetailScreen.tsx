import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';

import Button from '../../components/Button';
import Field from '../../components/Field';
import Select from '../../components/Select';
import { useAccessibility } from '../../accessibility/context';
import { SEVERITIES } from '../../services/pests';
import { usePestDetail } from '../../hooks/usePestDetail';

export default function PestDetailScreen() {
    const { palette } = useAccessibility();
    const { control, loading, saving, saved, screenError, onSubmit, handleDelete } =
        usePestDetail();

    if (loading) {
        return (
            <View className={`flex-1 items-center justify-center ${palette.bg}`}>
                <ActivityIndicator color={palette.spinner} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className={`flex-1 ${palette.bg}`}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
                <Text className={`text-2xl font-bricolage ${palette.title}`}>Plaga</Text>
                <Text className={`mb-5 text-sm ${palette.sub}`}>Edita los datos del registro de plaga</Text>

                {saved ? (
                    <View className={`mb-4 rounded-lg p-3 ${palette.successBanner}`}>
                        <Text className="text-center text-sm font-inter-semibold">
                            Cambios guardados correctamente
                        </Text>
                    </View>
                ) : null}

                {screenError ? (
                    <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
                        <Text className="text-center text-sm font-inter-semibold">{screenError}</Text>
                    </View>
                ) : null}

                <View className={`mb-6 rounded-2xl p-5 ${palette.card}`}>
                    <Text className={`mb-4 text-lg font-bricolage ${palette.title}`}>Editar datos</Text>

                    <Field
                        control={control}
                        name="commonName"
                        label="Nombre común *"
                        autoCapitalize="words"
                        rules={{
                            required: 'El nombre común es obligatorio',
                            maxLength: {
                                value: 100,
                                message: 'El nombre debe tener máximo 100 caracteres',
                            },
                        }}
                    />

                    <Field
                        control={control}
                        name="scientificName"
                        label="Nombre científico"
                        autoCapitalize="words"
                        rules={{
                            maxLength: {
                                value: 200,
                                message: 'El nombre científico debe tener máximo 200 caracteres',
                            },
                        }}
                    />

                    <Select
                        control={control}
                        name="severity"
                        label="Severidad"
                        options={SEVERITIES.map((severity) => ({
                            value: severity,
                            label: severity.charAt(0).toUpperCase() + severity.slice(1),
                        }))}
                    />

                    <Field
                        control={control}
                        name="symptoms"
                        label="Síntomas (separados por coma)"
                        multiline
                        numberOfLines={3}
                        rules={{
                            maxLength: {
                                value: 1000,
                                message: 'Los síntomas deben tener máximo 1000 caracteres',
                            },
                        }}
                    />

                    <Button
                        text={saving ? 'Guardando…' : 'Guardar cambios'}
                        onPress={onSubmit}
                        disabled={saving}
                    />

                </View>

                <Button text="Eliminar plaga" danger onPress={handleDelete} />

            </ScrollView>
        </KeyboardAvoidingView>
    );
}