import { Directive, HostBinding, HostListener } from '@angular/core'

@Directive ({
    selector: '[cmsDropdown]'
})

// to use, import and add DropDownDirective to app.module.ts
// finally, add selector name to element where class should be attached
export class DropdownDirective {
    // bind property to specified property e.g. class property
    @HostBinding('class.open') isOpen = false;

    // listen for click event, call function when caught
    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen;
    }
}
