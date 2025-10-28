import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-entry-row',
  templateUrl: './entry-row.component.html',
  styleUrls: ['./entry-row.component.scss'],
  standalone: false,
})
export class EntryRowComponent {
  /** boxes array, e.g. ['06','90','','',''] */
  @Input() boxes: string[] = [];

  /** how many leading boxes are locked/selectable (prefix/operator) */
  @Input() lockedCount = 2;

  /** id for the row (1,2,3) */
  @Input() rowId!: number;

  /** whether this row is the active row (for highlight) */
  @Input() active = false;

  /**
   * Emitted when a locked cell (prefix/operator) is clicked.
   * Payload: { rowId, index } where index is cell index (0 or 1)
   */
  @Output() lockedCellClicked = new EventEmitter<{ rowId: number; index: number }>();

  onLockedCellClick(index: number) {
    // only emit for locked cells (parent will set active row)
    if (index < this.lockedCount) {
      this.lockedCellClicked.emit({ rowId: this.rowId, index });
    }
  }
}
