import { Entry, Manager } from "./Manager";
import { UUID } from "./trivial"

enum Role {
    RegisteredUser = 0,
    Marketer,
    Manager,
    Admin
}

class User implements Entry {
    id: UUID | undefined = undefined;
    instanceID: UUID | undefined | null = null;
    email: string;
    passwd: string;
    name: string;
    mobile: string;
    roles: Role[];

    constructor(email: string, passwd: string, name: string, mobile: string, roles: Role[]) {
        this.email = email;
        this.passwd = passwd;
        this.name = name;
        this.mobile = mobile;
        this.roles = roles;
    }
}

class UserManager extends Manager<User> {
    constructor() {
        super(null)
    }
}

export { Role, User, UserManager }