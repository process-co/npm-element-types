"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
require("./schema-documentation");
zod_1.z.string().example('Apollo Global LLC');
zod_1.z.number().example(3500);
zod_1.z.object({ businessName: zod_1.z.string() }).example({ businessName: 'Apollo Global LLC' });
// @ts-expect-error examples are typed from the schema input
zod_1.z.number().example('not a number');
zod_1.z.string().meta({
    description: 'Legal business name',
    examples: ['Apollo Global LLC'],
    default: 'Apollo Global LLC',
    readOnly: false,
});
zod_1.z.object({
    businessName: zod_1.z.string(),
    averageTicket: zod_1.z.number(),
}).meta({
    description: 'Merchant signup request',
    examples: [{ businessName: 'Apollo Global LLC', averageTicket: 3500 }],
});
zod_1.z.number().meta({
    // @ts-expect-error examples are typed from the documented schema input
    examples: ['not a number'],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWRvY3VtZW50YXRpb24udGVzdC1kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NjaGVtYS1kb2N1bWVudGF0aW9uLnRlc3QtZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUF3QjtBQUN4QixrQ0FBZ0M7QUFFaEMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3hDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsT0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFlBQVksRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUM7QUFFdEYsNERBQTREO0FBQzVELE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFbkMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztJQUNkLFdBQVcsRUFBRSxxQkFBcUI7SUFDbEMsUUFBUSxFQUFFLENBQUMsbUJBQW1CLENBQUM7SUFDL0IsT0FBTyxFQUFFLG1CQUFtQjtJQUM1QixRQUFRLEVBQUUsS0FBSztDQUNoQixDQUFDLENBQUM7QUFFSCxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ1AsWUFBWSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDeEIsYUFBYSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7Q0FDMUIsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNOLFdBQVcsRUFBRSx5QkFBeUI7SUFDdEMsUUFBUSxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDO0NBQ3ZFLENBQUMsQ0FBQztBQUVILE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDZCx1RUFBdUU7SUFDdkUsUUFBUSxFQUFFLENBQUMsY0FBYyxDQUFDO0NBQzNCLENBQUMsQ0FBQyJ9