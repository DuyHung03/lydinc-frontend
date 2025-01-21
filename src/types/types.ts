export type User = {
    userId: string;
    email: string;
    username: string;
    photoUrl: string;
    school: string;
    roles: string[];
};

export type Course = {
    courseId: number;
    title: string;
    enrollmentDate: string;
    status: string | null;
    image: string | null;
    lecturerId: string | null;
    lecturerName: string | null;
    lecturerEmail: string | null;
    lecturerPhoto: string | null;
    enrollments: Enrollment[];
};
export type Enrollment = {
    enrollmentId: number;
    enrollmentDate: string;
    status: string;
    user: User;
};

export type University = {
    universityId: number;
    shortName: string;
    fullName: string;
    logo: string | null;
    location: string | null;
    students: User[];
};
