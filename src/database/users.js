// // @flow

// type Comment = {
//   id: string,
//   user: User,
//   content: string,
//   createdAt: string,
// }

// type Post = {
//   id: string,
//   content: string,
//   createdAt: string,
//   comments: Array<Comment>,
// }

// type Project = {
//   id: string,
//   user: User,
//   project: {
//     track: {
//         bpm: number,
//         interval: number,
//         currentStep: number,
//         currentSequence: number,
//         sequences: [
//           {
//             id: string,
//             numberOfSteps: number
//           }
//         ],
//         audioContext: Object,
//         playerState: string,
//         playerMode: string,
//         editMode: string
//       },
//       instrument: {
//         instruments: [],
//         copyBuffer: [],
//       }
//   },
//   comments: Array<Comment>,
// }

// type User = {
//   // Account Information
//   id: string,
//   email: string,
//   // Public Information
//   profile: {
//     displayName: string, // Display name presented to users
//     bio: string, // User description of himself
//     links: Array<{
//       name: string, // Link display name
//       url: string, // Link url
//     }>,
//   },
//   posts: Array<Post>,
//   projects: Array<Project>,
// }
