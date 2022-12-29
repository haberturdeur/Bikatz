import { Entry, Manager } from "./Manager";
import { UUID } from "./trivial";

enum PMType {
    CreditCard,
    PublicTrasportCard,
}

class PaymentMethod implements Entry {
    id: UUID | undefined = undefined
    instanceID: UUID | undefined | null = undefined
    number: string
    type: PMType

    constructor(number: string, type: PMType) {
        this.number = number
        this.type = type
    }
}

class PMManager extends Manager<PaymentMethod> {
    PMs: Map<UUID, PaymentMethod>

    constructor() {
        super(null)
        this.PMs = new Map<UUID, PaymentMethod>()
    }

    createPM(number: string, type: PMType): PaymentMethod {
        return this.create(new PaymentMethod(number, type))
    }
}

abstract class PaymentGate {
    abstract isValid(method: PaymentMethod) : boolean
    abstract pay(cost: number, method: PaymentMethod): boolean
}

class CCGate extends PaymentGate {
    isValid(method: PaymentMethod): boolean {
        return method.type === PMType.CreditCard && Number(method.number) % 2 === 0
    }

    pay(cost: number, method: PaymentMethod): boolean {
        return this.isValid(method) // This would actually communicate with the bank
    }
}

class PTGate extends PaymentGate {
    isValid(method: PaymentMethod): boolean {
        return method.type === PMType.PublicTrasportCard && Number(method.number) % 5 === 0
    }

    pay(cost: number, method: PaymentMethod): boolean {
        return false // because systems in public sector never work xD
    }
}

export { PMType, PaymentMethod, PMManager, PaymentGate, CCGate, PTGate}