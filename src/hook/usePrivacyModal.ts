import { useState } from 'react';

export function usePrivacyModal(initialPrivacy = 'public') {
    const [opened, setOpened] = useState(false);
    const [privacy, setPrivacy] = useState(initialPrivacy);
    const [universityIds, setUniversityIds] = useState<number[]>([]);
    const [uncheckUniversityIds, setUncheckUniversityIds] = useState<number[]>([]);

    const openModal = () => setOpened(true);
    const closeModal = () => setOpened(false);

    const onPrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPrivacy(e.target.value);
    };

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const universityId = Number(value);
        setUniversityIds((prev) =>
            checked ? [...prev, universityId] : prev.filter((id) => id !== universityId)
        );
    };

    return {
        opened,
        privacy,
        universityIds,
        uncheckUniversityIds,
        setUncheckUniversityIds,
        setPrivacy,
        setUniversityIds,
        openModal,
        closeModal,
        onPrivacyChange,
        onCheckboxChange,
    };
}
