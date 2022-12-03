export default function comparePaths(path1: string, path2: string){
    const split1 = path1.split('/')
    const split2 = path2.split('/')

    const commonAncestor = []
    let i = 0

    for (i; i < split1.length; i++) {
        if(split1[i] !== split2[i]){
            break
        }
        commonAncestor.push(split1[i])
    }
    return {
        i,
        commonAncestor
    }
}