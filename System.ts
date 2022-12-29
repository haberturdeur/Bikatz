import { AreaManager } from "./Area"
import { BikeManager } from "./Bike"
import { CampaignManager } from "./Campaign"
import { PaymentGate, PMManager, PMType } from "./PaymentMethod"
import { RideManager } from "./Ride"
import { StandManager } from "./Stand"
import { ReportManager, StatusReport } from "./StatusReport"
import { UUID } from "./trivial"
import { UserManager } from "./User"

class Instance {
    id: UUID
    name: string

    campaigns: CampaignManager
    areas: AreaManager
    stands: StandManager
    reports: ReportManager
    bikes: BikeManager
    rides: RideManager

    constructor(id: UUID, name: string) {
        this.id = id
        this.name = name

        this.campaigns = new CampaignManager(id)
        this.areas = new AreaManager(id)
        this.stands = new StandManager(id)
        this.reports = new ReportManager(id)
        this.bikes = new BikeManager(id)
        this.rides = new RideManager(id)
    }

    processStatusReport(report: StatusReport) {
        this.reports.processReport(this, report)
    }
}

class System {
    users: UserManager
    paymentMethods: PMManager
    paymentGates: Map<PMType, PaymentGate>
    instances: Map<string, Instance>

    constructor() {
        this.users = new UserManager()
        this.paymentMethods = new PMManager()
        this.paymentGates = new Map<PMType, PaymentGate>()
        this.instances = new Map<string, Instance>()
    }

    createInstance(name: string): Instance {
        const instance = new Instance(name, name)
        this.instances.set(name, instance)
        return instance
    }

    processStatusReport(report: StatusReport) {
        this.instances.get(report?.instanceID!)?.processStatusReport(report)    
    }
}

export { Instance, System }
