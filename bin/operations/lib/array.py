# skip if array is empty, or every element is empty string.
def is_empty_row(arr):
    return True if len(arr) == 0 else all(x == '' for x in arr)


# slice an array using separators determined by a test function
def slice_arr(arr, test_fn):
    result = []
    buf = []
    for x in arr:
        if test_fn(x) and len(buf):
            result.append(buf)
            buf = []
        else:
            buf.append(x)

    # if there's anything in buffer at the end, append it
    if len(buf):
        result.append(buf)
    return result


# get the first word of a cell in an array
def first_word(arr, idx):
    cell = arr[idx]
    return cell.split(' ')[0]
