import { useState } from 'react';

export function usePrivacyModal(initialPrivacy = 'public') {
    const [opened, setOpened] = useState(false);
    const [privacy, setPrivacy] = useState(initialPrivacy);
    const [selectedUniversityIds, setSelectedUniversityIds] = useState<number[]>([]);
    const [initialUniversityIds, setInitialUniversityIds] = useState<number[]>([]);
    const [uncheckUniversityIds, setUncheckUniversityIds] = useState<number[]>([]);

    const openModal = () => setOpened(true);
    const closeModal = () => setOpened(false);

    const onPrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPrivacy(e.target.value);
    };

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const universityId = Number(value);

        setSelectedUniversityIds((prev) =>
            checked ? [...prev, universityId] : prev.filter((id) => id !== universityId)
        );

        setUncheckUniversityIds((prev) => {
            if (!checked && initialUniversityIds.includes(universityId)) {
                // If it was initially selected but is now unchecked, add to uncheck list
                return [...prev, universityId];
            } else {
                // If checked again, remove it from uncheck list
                return prev.filter((id) => id !== universityId);
            }
        });
    };

    return {
        opened,
        privacy,
        selectedUniversityIds,
        uncheckUniversityIds,
        initialUniversityIds,
        setInitialUniversityIds,
        setUncheckUniversityIds,
        setPrivacy,
        setSelectedUniversityIds,
        openModal,
        closeModal,
        onPrivacyChange,
        onCheckboxChange,
    };
}
