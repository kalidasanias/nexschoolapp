package com.ga;

import java.util.Comparator;

public class ClassSortingComparator implements Comparator<Class> {
	 
    @Override
    public int compare(Class cust1, Class cust2) {
 
        // all comparison
        int compareGroupId = ((Integer) cust1.getGroupId()).compareTo((Integer)cust2.getGroupId());
        int compareTimeslotId =  ((Integer) cust1.getTimeslotId()).compareTo((Integer)cust2.getTimeslotId());
 
        // 3-level comparison using if-else block
        if(compareGroupId == 0) {
            return compareTimeslotId;
        } else {
            return compareGroupId;
        }
    }

	
}
