import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';
import { GraphThirdLayerService } from './graph-third-layer.service';
import { TableService } from './table.service';

export class MaterializerService {
  constructor(
    private readonly firstLayerService: GraphFirstLayerService,
    private readonly secondLayerService: GraphSecondLayerService,
    private readonly thirdLayerService: GraphThirdLayerService,
    private readonly tableService: TableService,
  ) {}
}
