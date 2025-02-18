import { useState } from 'react';

export function usePrivacyModal(initialPrivacy = 'public') {
    const [opened, setOpened] = useState(false);
    const [privacy, setPrivacy] = useState(initialPrivacy);
    const [selectedUniversityIds, setSelectedUniversityIds] = useState<number[]>([]);
    const [initialUniversityIds, setInitialUniversityIds] = useState<number[]>([]);
    const [uncheckUniversityIds, setUncheckUniversityIds] = useState<number[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const openModal = () => setOpened(true);
    const closeModal = () => setOpened(false);

    const onPrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPrivacy(e.target.value);
    };

    const onUniversityCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const onUserCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const userId = value;

        setSelectedUserIds((prev) =>
            checked ? [...prev, userId] : prev.filter((id) => id !== userId)
        );
    };

    return {
        opened,
        privacy,
        selectedUniversityIds,
        uncheckUniversityIds,
        initialUniversityIds,
        selectedUserIds,
        setSelectedUserIds,
        setInitialUniversityIds,
        setUncheckUniversityIds,
        setPrivacy,
        setSelectedUniversityIds,
        openModal,
        closeModal,
        onPrivacyChange,
        onUniversityCheckboxChange,
        onUserCheckboxChange,
    };
}
