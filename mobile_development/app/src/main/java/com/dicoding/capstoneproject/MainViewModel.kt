package com.dicoding.capstoneproject

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dicoding.capstoneproject.data.database.Repository
import com.dicoding.capstoneproject.data.inject.Event
import com.dicoding.capstoneproject.data.preference.SessionModel
import kotlinx.coroutines.launch

class MainViewModel (private val repository: Repository) : ViewModel() {
    val toastText: LiveData<Event<String>> = repository.toastText

    fun getSession(): LiveData<SessionModel> {
        return repository.getSession()
    }

    fun logoutApp() {
        viewModelScope.launch {
            repository.logout()
        }
    }
}