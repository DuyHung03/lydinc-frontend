export type User = {
    userId: string;
    email: string;
    name: string;
    username: string;
    photoUrl: string;
    phone: string | null;
    university: University;
    isPasswordFirstChanged: number;
    isAccountGranted: number;
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

export type Module = {
    moduleId: string;
    index: number;
    moduleTitle: string;
    status: string;
    level: number;
    parentModuleId: string;
};

export type Lesson = {
    lessonId: string;
    lessonTitle: string;
    lessonContent: string;
    module: Module;
};

export type StudentAccount = {
    username: string | null;
    falcuty: string | null;
    universityId: number | null;
    shortName: string;
    email: string;
    phone: string;
};
