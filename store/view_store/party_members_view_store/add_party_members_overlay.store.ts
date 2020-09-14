import { action, computed, observable } from "mobx";
import { Member } from "../../../entities/member.entity";
import { AsyncSaveStore } from "../../pattern_store/async_save.store";

export class AddPartyMembersOverlayStore extends AsyncSaveStore{
    @observable private selectedMembers: Set<Member> = new Set();

    @computed
    get checkedMembers() {
        return Array.from(this.selectedMembers);
    }

    @action.bound
    toggleMember(member: Member) {
        if (this.selectedMembers.has(member)) {
            this.selectedMembers.delete(member)
        } else {
            this.selectedMembers.add(member)
        }
    }

    @action.bound
    clearStore() {
        this.selectedMembers.clear();
        this.setSaveStatusInit();
    }
}