import type Processor from '../Processor';
import { JOB_STATUS } from '../constants';
import type { FlowNodeModel } from '../types';
import { Instruction } from '.';

export class UpdateInstruction extends Instruction {
  async run(node: FlowNodeModel, input, processor: Processor) {
    const { collection, params = {} } = node.config;

    const repo = (<typeof FlowNodeModel>node.constructor).database.getRepository(collection);
    const options = processor.getParsedValue(params, node.id);
    const result = await repo.update({
      ...options,
      context: {
        executionId: processor.execution.id,
      },
      // transaction: processor.transaction,
    });

    return {
      result: result.length ?? result,
      status: JOB_STATUS.RESOLVED,
    };
  }
}

export default UpdateInstruction;
