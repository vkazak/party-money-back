import { action, computed, observable } from "mobx";
import { Member } from "../../entities/member.entity";
import { AsyncSaveStore } from "../pattern_store/async_save.store";

export class AddPartyMembersOverlayStore extends AsyncSaveStore{
    multiplePick: boolean;
    @observable private selectedMembers: Set<Member>;
    @observable private selectedMember: Member | null;

    @computed
    get selected(): Array<Member> | Member | null {
        if (this.multiplePick)
            return Array.from(this.selectedMembers);
        else {
            return this.selectedMember
        }
    }

    @action.bound
    toggleMember(member: Member) {
        if (this.multiplePick) {
            if (this.selectedMembers.has(member)) {
                this.selectedMembers.delete(member)
            } else {
                this.selectedMembers.add(member)
            }
        } else {
            this.selectedMember = member;
        }
    }

    @action.bound
    clearStore() {
        this.setSaveStatusInit();
    }

    constructor(
        multiplePick: boolean, 
        currentUser: Member | null = null, 
        initSelectedMembers: Array<Member> = []
    ) {
        super();
        this.multiplePick = multiplePick;
        this.selectedMember = currentUser;
        this.selectedMembers = new Set(initSelectedMembers)
    }
}