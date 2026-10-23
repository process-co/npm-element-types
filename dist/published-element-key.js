"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishedElementLocalKey = publishedElementLocalKey;
/** Strip only the complete namespace prefix, preserving the operation's local spelling. */
function publishedElementLocalKey(namespace, qualifiedKey) {
    const key = qualifiedKey.trim();
    const normalized = namespace.trim().replaceAll('_', '-');
    const boundary = normalized ? `${normalized}-` : '';
    // Historical provider keys retain underscores in their namespace prefix.
    // Compare only that prefix; underscores inside the local operation are significant.
    if (boundary && key.length > boundary.length
        && key.slice(0, boundary.length).replaceAll('_', '-') === boundary) {
        return key.slice(boundary.length);
    }
    return key;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGlzaGVkLWVsZW1lbnQta2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3B1Ymxpc2hlZC1lbGVtZW50LWtleS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDREQVdDO0FBWkQsMkZBQTJGO0FBQzNGLFNBQWdCLHdCQUF3QixDQUFDLFNBQWlCLEVBQUUsWUFBb0I7SUFDOUUsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hDLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3BELHlFQUF5RTtJQUN6RSxvRkFBb0Y7SUFDcEYsSUFBSSxRQUFRLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTTtXQUN2QyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUNyRSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMifQ==