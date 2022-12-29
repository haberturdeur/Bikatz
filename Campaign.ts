import { UUID } from "./trivial"
import { Area } from "./Area"
import { Entry, Manager } from "./Manager"

class Campaign implements Entry {
    id: UUID | undefined = undefined
    instanceID: UUID | undefined | null = undefined
    validFrom: EpochTimeStamp
    validTo: EpochTimeStamp
    discount: number

    constructor(validFrom: EpochTimeStamp, validTo: EpochTimeStamp, discount: number) {
        this.validFrom = validFrom
        this.validTo = validTo
        this.discount = discount
    }
}

interface AreaCampaignType {
    starting: boolean
    ending: boolean
    passingThrough: boolean
}

class AreaCampaign extends Campaign {
    area: Area
    type: AreaCampaignType

    constructor(validFrom: EpochTimeStamp, validTo: EpochTimeStamp, discount: number, area: Area, type: AreaCampaignType) {
        super(validFrom, validTo, discount)
        this.area = area
        this.type = type
    }
}

class Voucher{
    id: UUID
    code: string

    constructor(id: UUID, code: string) {
        this.id = id
        this.code = code
    }
}

class VoucherCampaign extends Campaign {
    vouchers: Map<UUID, Voucher>

    constructor(validFrom: EpochTimeStamp, validTo: EpochTimeStamp, discount: number) {
        super(validFrom, validTo, discount)
        this.vouchers = new Map<UUID, Voucher>()
    }
}

class CampaignManager extends Manager<Campaign> {

    constructor(instanceID: UUID | null) {
        super(instanceID)
    }
}

export { VoucherCampaign, AreaCampaign, CampaignManager, Voucher, AreaCampaignType }